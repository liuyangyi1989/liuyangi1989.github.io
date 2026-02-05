const RIASEC_DIMENSIONS = {
  R: {
    name: "R 实用型（Realistic）",
    description: "偏好动手实践、机械设备、户外任务与具体操作，常见于工程、制造、技术维护等领域。"
  },
  I: {
    name: "I 研究型（Investigative）",
    description: "偏好分析、探索与逻辑推理，关注问题本质，常见于科研、数据分析、医学与技术研发。"
  },
  A: {
    name: "A 艺术型（Artistic）",
    description: "偏好创意表达、审美与非结构化任务，常见于设计、写作、音乐、内容创作等方向。"
  },
  S: {
    name: "S 社会型（Social）",
    description: "偏好帮助他人、沟通协作与教育支持，常见于教育、咨询、服务与人力方向。"
  },
  E: {
    name: "E 企业型（Enterprising）",
    description: "偏好影响他人、组织推动与达成目标，常见于销售、管理、创业、商务拓展。"
  },
  C: {
    name: "C 常规型（Conventional）",
    description: "偏好秩序流程、数据整理与细节执行，常见于财务、行政、运营、项目协调。"
  }
};

const QUESTIONS = [
  { text: "我喜欢使用工具或设备完成具体任务。", dimension: "R" },
  { text: "我愿意通过分析数据或事实来解决问题。", dimension: "I" },
  { text: "我喜欢通过文字、图像或音乐表达想法。", dimension: "A" },
  { text: "我乐于倾听并帮助他人解决困扰。", dimension: "S" },
  { text: "我享受说服他人、推动事情进展。", dimension: "E" },
  { text: "我喜欢按流程整理资料并保持条理。", dimension: "C" },
  { text: "相比纯思考，我更喜欢动手把东西做出来。", dimension: "R" },
  { text: "我常对“为什么会这样”产生强烈好奇。", dimension: "I" },
  { text: "我希望工作中有较多自由发挥和创造空间。", dimension: "A" },
  { text: "我在团队中愿意承担组织协调或带动角色。", dimension: "E" }
];

let radarChart = null;

function renderQuestions() {
  const form = document.getElementById("quiz-form");

  QUESTIONS.forEach((q, index) => {
    const card = document.createElement("section");
    card.className = "question";

    const title = document.createElement("h3");
    title.textContent = `第 ${index + 1} 题：${q.text}`;
    card.appendChild(title);

    const tag = document.createElement("span");
    tag.className = "dimension-tag";
    tag.textContent = `维度：${q.dimension}`;
    card.appendChild(tag);

    const group = document.createElement("div");
    group.className = "rating-group";

    for (let score = 1; score <= 5; score += 1) {
      const label = document.createElement("label");
      label.className = "rating-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q-${index}`;
      input.value = String(score);
      input.required = true;

      label.appendChild(input);
      label.append(` ${score}分`);
      group.appendChild(label);
    }

    card.appendChild(group);
    const progressText = document.getElementById("progress-text");
    form.insertBefore(card, progressText);
  });
}

function collectAnswers() {
  return QUESTIONS.map((_, index) => {
    const checked = document.querySelector(`input[name='q-${index}']:checked`);
    return checked ? Number(checked.value) : null;
  });
}

function calculateScores(answers) {
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  QUESTIONS.forEach((q, idx) => {
    const score = answers[idx] ?? 0;
    scores[q.dimension] += score;
  });

  return scores;
}

function getTopCodes(scores, topN = 3) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([code, value]) => `${code}(${value})`)
    .join(" - ");
}

function updateSubmitState() {
  const submitBtn = document.getElementById("submit-btn");
  const progressText = document.getElementById("progress-text");
  const answeredCount = collectAnswers().filter((ans) => ans !== null).length;

  progressText.textContent = `当前进度：${answeredCount} / ${QUESTIONS.length} 题`;
  submitBtn.disabled = answeredCount !== QUESTIONS.length;
}

function renderRadar(scores) {
  const labels = Object.keys(RIASEC_DIMENSIONS);
  const data = labels.map((k) => scores[k]);
  const canvas = document.getElementById("radar-chart");

  if (radarChart) {
    radarChart.destroy();
  }

  radarChart = new Chart(canvas, {
    type: "radar",
    data: {
      labels,
      datasets: [
        {
          label: "职业兴趣得分",
          data,
          fill: true,
          backgroundColor: "rgba(56, 103, 255, 0.20)",
          borderColor: "rgba(56, 103, 255, 1)",
          pointBackgroundColor: "rgba(56, 103, 255, 1)"
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: { stepSize: 2 }
        }
      }
    }
  });
}

function renderExplanations(scores) {
  const root = document.getElementById("dimension-explanations");
  root.innerHTML = "";

  Object.entries(RIASEC_DIMENSIONS).forEach(([code, meta]) => {
    const card = document.createElement("article");
    card.className = "dimension-card";
    card.innerHTML = `
      <h4>${meta.name}</h4>
      <p><strong>得分：</strong>${scores[code]}</p>
      <p>${meta.description}</p>
    `;
    root.appendChild(card);
  });
}

function showResults(scores) {
  document.getElementById("result-section").classList.remove("hidden");
  document.getElementById("top-codes").textContent = getTopCodes(scores);
  renderRadar(scores);
  renderExplanations(scores);
}

async function exportPdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const scores = window.__latestScores;

  if (!scores) {
    alert("请先生成测评结果，再导出 PDF。");
    return;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("霍兰德职业兴趣测评报告", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`生成时间：${new Date().toLocaleString()}`, 14, 26);
  doc.text(`前三兴趣类型：${getTopCodes(scores)}`, 14, 34);

  const chartCanvas = document.getElementById("radar-chart");
  const chartImage = chartCanvas.toDataURL("image/png", 1.0);
  doc.addImage(chartImage, "PNG", 14, 40, 180, 95);

  let y = 145;
  Object.entries(RIASEC_DIMENSIONS).forEach(([code, meta]) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.text(`${meta.name}：${scores[code]}分`, 14, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(meta.description, 180);
    doc.text(wrapped, 14, y);
    y += wrapped.length * 5 + 4;
  });

  doc.save("霍兰德职业兴趣测评报告.pdf");
}

function bindEvents() {
  const quizForm = document.getElementById("quiz-form");

  quizForm.addEventListener("change", updateSubmitState);

  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const answers = collectAnswers();
    const hasUnanswered = answers.some((a) => a === null);

    if (hasUnanswered) {
      alert("请完成全部 10 道题后再提交。");
      return;
    }

    const scores = calculateScores(answers);
    window.__latestScores = scores;
    showResults(scores);
    document.getElementById("result-section").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    quizForm.reset();
    document.getElementById("result-section").classList.add("hidden");
    window.__latestScores = null;
    if (radarChart) {
      radarChart.destroy();
      radarChart = null;
    }
    updateSubmitState();
  });

  document.getElementById("export-pdf-btn").addEventListener("click", exportPdf);
}

document.addEventListener("DOMContentLoaded", () => {
  renderQuestions();
  bindEvents();
  updateSubmitState();
});
