# Contributing to AlgoLens 🤝

Thank you for your interest in contributing to AlgoLens! We want to make this project the best interactive algorithm visualizer on the web, and we welcome contributions of all kinds: bug fixes, new visualizers, performance improvements, or documentation updates.

Please take a moment to review this guide to ensure a smooth and efficient contribution process.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to [your.email@example.com].

---

## How Can I Contribute?

### 1. Reporting Bugs 🐛
If you find a bug:
1. Search the [Issues page](https://github.com/angelonels/Algolens/issues) to check if it has already been reported.
2. If not, open a new issue using the **Bug Report** template.
3. Be as descriptive as possible. Include steps to reproduce, what you expected, what actually happened, and screenshots if applicable.

### 2. Suggesting Features 💡
If you have an idea for a new visualizer or improvement:
1. Check the existing list of algorithms in [README.md](README.md) and current issues to ensure it is not already being worked on.
2. Open a new issue using the **Feature Request** template.
3. Describe the visualizer or feature, how it should animate, and why it would be valuable to learners.

### 3. Submitting Pull Requests 🚀
If you want to contribute code:
1. **Fork** the repository and clone it to your local machine.
2. Create a new branch with a descriptive name:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```
3. Make your changes (see the development section below).
4. Run formatting, linting, and tests to verify everything is correct.
5. Commit your changes. We use pre-commit hooks that automatically run linting and formatting on your staged files.
6. Push to your fork and open a Pull Request against the `main` branch of this repository.

---

## Local Development Setup

### Prerequisites
* [Node.js](https://nodejs.org) (v20 or higher is recommended)
* `npm` (packaged with Node.js)

### Installation
1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/Algolens.git
   cd Algolens
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the development server URL in your browser (usually `http://localhost:5173`).

---

## Coding Guidelines & Standards

To maintain code quality and readability, please adhere to the following standards:

### 1. Language & Frameworks
* **React 19 & TypeScript**: Ensure all components and files are fully typed. Avoid using `any` types.
* **Tailwind CSS v4**: Use utility classes for styling. Follow the existing visual themes (supporting dark mode via class-based dark classes).
* **Framer Motion**: Use Framer Motion for animations. Follow the spring configurations defined in [src/utils/animationConfig.ts](src/utils/animationConfig.ts) to maintain visual consistency.

### 2. Code Formatting & Linting
We use **Prettier** for code formatting and **ESLint** for code quality checks.
* To check linting:
  ```bash
  npm run lint
  ```
* To format all code:
  ```bash
  npm run format
  ```
Your commits will be checked automatically via pre-commit hooks using `husky` and `lint-staged`.

### 3. Writing Tests
We use **Vitest** and **React Testing Library** for testing. 
* If you write utility helper functions or complex state engines, please add tests.
* To run tests:
  ```bash
  npm run test
  ```

---

## Pull Request Checklist

Before submitting your PR, please make sure you can check all of the following:
* [ ] My code follows the code style of this project.
* [ ] My changes build locally without errors (`npm run build`).
* [ ] ESLint passes without errors or warnings (`npm run lint`).
* [ ] Prettier formatting has been applied (`npm run format`).
* [ ] I have added tests for new functionality, and all existing tests pass (`npm run test`).
* [ ] I have linked any relevant issues in my PR description.
