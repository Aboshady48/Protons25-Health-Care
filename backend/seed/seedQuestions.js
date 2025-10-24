const axios = require("axios");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhZG1pbjEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTk5ODMyMjAsImV4cCI6MTc5MTU0MDgyMH0.7lejujM72hv_OL0RdDfDWp2vI2N8B08AES6fSeHTnz0"; // 🔐 Replace with a fresh admin token

const questions = [
  {
    text: "Over the past few days, how often have you felt little interest or pleasure in doing things?",
    type: "default",
  },
  {
    text: "How often have you felt down, depressed, or hopeless?",
    type: "default",
  },
  {
    text: "How often have you felt nervous, anxious, or on edge?",
    type: "default",
  },
  {
    text: "How often have you had trouble relaxing or calming down?",
    type: "default",
  },
  {
    text: "Have you noticed changes in your sleep (falling asleep, staying asleep, waking up too early)?",
    type: "sleep",
  },
  {
    text: "How often have you felt tired or had little energy, even after rest?",
    type: "default",
  },
  {
    text: "How often have you had difficulty concentrating (e.g., reading, working, conversations)?",
    type: "default",
  },
  {
    text: "How often have you felt bad about yourself — that you are a failure or have let yourself/others down?",
    type: "default",
  },
  {
    text: "How often have you felt irritable, restless, or had trouble sitting still?",
    type: "default",
  },
  {
    text: "Have you had thoughts that you would be better off not being here, or of hurting yourself?",
    type: "safety",
  },
];

const optionSets = {
  default: [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every day", value: 3 },
  ],
  sleep: [
    { label: "No problems with sleep", value: 0 },
    { label: "Mild issues", value: 1 },
    { label: "Moderate issues", value: 2 },
    { label: "Severe issues", value: 3 },
  ],
  safety: [
    { label: "Never", value: 0 },
    { label: "Sometimes, but fleeting", value: 1 },
    { label: "Frequently, but I don’t intend to act", value: 2 },
    { label: "Yes, with serious intent", value: 3 },
  ],
};

(async () => {
  try {
    for (const q of questions) {
      const res = await axios.post(
        "http://localhost:5000/api/questions/add",
        {
          text: q.text,
          type: q.type,
          options: optionSets[q.type] || optionSets.default,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`✅ Added: "${q.text}" (ID: ${res.data.questionId})`);
    }

    console.log("🎉 All mood tracker questions added successfully!");
  } catch (err) {
    console.error("❌ Error seeding questions:", err.response?.data || err.message);
  }
})();
