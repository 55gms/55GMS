class ModelManager {
  constructor() {
    this.tokenLimit = 498000;
    this.tokenUsage = 0;

    this.modelData = `
gemma2-9b-it
llama-3.3-70b-versatile
llama-3.1-8b-instant
deepseek-r1-distill-llama-70b
llama3-70b-8192
llama3-8b-8192
qwen/qwen3-32b
meta-llama/llama-4-maverick-17b-128e-instruct
meta-llama/llama-4-scout-17b-16e-instruct
`
      .trim()
      .split("\n")
      .map((line) => {
        return { name: line.trim() };
      });

    this.currentModelIndex = 0;
    this.currentModel = this.modelData[this.currentModelIndex].name;
  }

  switchModel() {
    this.currentModelIndex =
      (this.currentModelIndex + 1) % this.modelData.length;
    this.currentModel = this.modelData[this.currentModelIndex].name;
    this.tokenUsage = 0;
    console.log(`Switched to model: ${this.currentModel}`);
  }

  getCurrentModel() {
    return this.currentModel;
  }

  getTokenUsage() {
    return this.tokenUsage;
  }

  addTokenUsage(tokens) {
    this.tokenUsage += tokens;
  }

  shouldSwitchModel() {
    return this.tokenUsage >= this.tokenLimit;
  }
}

export default ModelManager;
