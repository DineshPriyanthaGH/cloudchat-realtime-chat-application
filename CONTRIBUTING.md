# Contributing to CloudChat 🤝

Thank you for considering contributing to CloudChat! We appreciate your interest in making this project better.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Guidelines](#development-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Firebase account (for testing)
- Basic knowledge of React, TypeScript, and Firebase

### Setting Up Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/cloudchat-realtime-chat-application.git
   cd cloudchat-realtime-chat-application/cloudchat
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Create a Firebase project** for testing
6. **Configure environment** variables in `src/firebaseConfig.ts`

## How to Contribute

### 🐛 Reporting Bugs

- Check if the bug has already been reported in [Issues](https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application/issues)
- Use the bug report template
- Include steps to reproduce, expected behavior, and screenshots if applicable

### ✨ Suggesting Features

- Check if the feature has already been suggested
- Use the feature request template
- Explain the use case and benefits

### 💻 Code Contributions

1. **Check existing issues** for something to work on
2. **Comment on the issue** to let others know you're working on it
3. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes**
5. **Test thoroughly**
6. **Commit with descriptive messages**
7. **Push to your fork**
8. **Create a Pull Request**

## Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Format code consistently (if configured)
- **Components**: Use functional components with hooks
- **File naming**: Use PascalCase for components, camelCase for utilities

### Component Guidelines

```typescript
// ✅ Good component structure
interface ComponentProps {
  title: string;
  isVisible?: boolean;
}

export const Component: React.FC<ComponentProps> = ({ title, isVisible = true }) => {
  // Component logic here
  return (
    <div>
      {isVisible && <h1>{title}</h1>}
    </div>
  );
};
```

### Firebase Guidelines

- Use TypeScript interfaces for Firestore documents
- Implement proper error handling
- Follow security best practices
- Use proper indexing for queries

### Testing

- Write unit tests for utility functions
- Test components with user interactions
- Test Firebase integration thoroughly
- Run tests before submitting PR: `npm run test`

## Commit Guidelines

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
feat(auth): add Google OAuth integration
fix(chat): resolve message ordering issue
docs(readme): update installation instructions
style(components): format with prettier
refactor(hooks): simplify useNotifications hook
test(auth): add login component tests
chore(deps): update firebase to v11.10.0
```

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Tests pass locally
- [ ] Documentation updated if needed
- [ ] No console errors or warnings

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** by maintainers
4. **Approval** and merge

## Issue Guidelines

### Bug Reports

```markdown
**Bug Description**
Clear and concise description

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]
```

### Feature Requests

```markdown
**Feature Description**
Clear and concise description of the feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Any other context or screenshots
```

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special mentions for first-time contributors

## Questions?

- 💬 [GitHub Discussions](https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application/discussions)
- 📧 Email: [maintainer-email@example.com]
- 🐛 [Issues](https://github.com/DineshPriyanthaGH/cloudchat-realtime-chat-application/issues)

Thank you for contributing to CloudChat! 🚀
