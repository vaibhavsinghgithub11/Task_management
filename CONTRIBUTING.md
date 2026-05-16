# Contributing to Team Task Management System

First off, thank you for considering contributing to Team Task Management System! It's people like you that make this project better.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/your-username/team-task-manager.git
   cd team-task-manager
   ```
3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/team-task-manager.git
   ```
4. **Create a branch** for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When reporting a bug, include:**
- Clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, browser)
- Error messages or logs

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., macOS, Windows, Linux]
- Node Version: [e.g., 18.0.0]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other context about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

**When suggesting an enhancement, include:**
- Clear and descriptive title
- Detailed description of the proposed feature
- Explain why this enhancement would be useful
- List any alternatives you've considered
- Mockups or examples (if applicable)

**Enhancement Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

### Code Contributions

1. **Find an issue** to work on or create a new one
2. **Comment** on the issue to let others know you're working on it
3. **Fork and clone** the repository
4. **Create a branch** for your changes
5. **Make your changes** following our coding standards
6. **Test your changes** thoroughly
7. **Commit your changes** with clear messages
8. **Push to your fork** and submit a pull request

## 💻 Development Setup

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB (v6+)
- Git

### Setup Steps

1. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Setup environment variables**
   ```bash
   # Copy example files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Edit with your values
   ```

3. **Start MongoDB**
   ```bash
   mongod
   ```

4. **Run development servers**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev
   
   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` type
- Use meaningful variable and function names

**Good:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (userId: string): Promise<User> => {
  // implementation
};
```

**Bad:**
```typescript
const getUser = async (id: any): Promise<any> => {
  // implementation
};
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for props
- Extract reusable logic into custom hooks

**Good:**
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
```

### File Naming

- Use PascalCase for components: `UserProfile.tsx`
- Use camelCase for utilities: `apiHelper.ts`
- Use kebab-case for CSS: `user-profile.css`

### Code Organization

- One component per file
- Group related files in folders
- Keep files under 300 lines
- Extract complex logic into separate functions

### Comments

- Write self-documenting code
- Add comments for complex logic
- Use JSDoc for functions
- Keep comments up to date

**Good:**
```typescript
/**
 * Calculates the completion rate of tasks
 * @param completed - Number of completed tasks
 * @param total - Total number of tasks
 * @returns Completion rate as a percentage
 */
const calculateCompletionRate = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return (completed / total) * 100;
};
```

### Error Handling

- Always handle errors gracefully
- Provide user-friendly error messages
- Log errors for debugging
- Use try-catch blocks

**Good:**
```typescript
try {
  const response = await api.get('/users');
  setUsers(response.data);
} catch (error: any) {
  const message = error.response?.data?.error || 'Failed to fetch users';
  setError(message);
  console.error('Error fetching users:', error);
}
```

## 📋 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

**Good commit messages:**
```
feat(auth): add password reset functionality

Implement password reset flow with email verification.
Users can now request a password reset link via email.

Closes #123
```

```
fix(tasks): resolve status update bug

Fix issue where task status wasn't updating in real-time.
Added proper state management for status changes.

Fixes #456
```

```
docs(readme): update installation instructions

Add detailed steps for MongoDB setup and environment configuration.
```

**Bad commit messages:**
```
fixed stuff
update
changes
wip
```

### Commit Best Practices

- Write clear, descriptive messages
- Use present tense ("add" not "added")
- Keep subject line under 50 characters
- Separate subject from body with blank line
- Reference issues and pull requests

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch** with latest changes
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests** (if available)
   ```bash
   npm test
   ```

3. **Check for linting errors**
   ```bash
   npm run lint
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

### Submitting a Pull Request

1. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a pull request** on GitHub

3. **Fill out the PR template**
   - Describe your changes
   - Link related issues
   - Add screenshots (if UI changes)
   - List any breaking changes

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Changes Made
- Added feature X
- Fixed bug Y
- Updated documentation Z

## Screenshots (if applicable)
[Add screenshots here]

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] No console errors
- [ ] Responsive design verified

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Address feedback** if requested
4. **Approval** from at least one maintainer
5. **Merge** by maintainers

### After Merge

1. **Delete your branch**
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your fork**
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

## 🐛 Debugging Tips

### Backend Debugging

```bash
# Enable debug mode
NODE_ENV=development npm run dev

# Check MongoDB connection
mongosh mongodb://localhost:27017/team-task-manager

# View logs
tail -f logs/error.log
```

### Frontend Debugging

```javascript
// Check environment variables
console.log(import.meta.env);

// Check API calls
console.log('API Response:', response);

// Check state
console.log('Current State:', state);
```

## 📚 Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## ❓ Questions?

If you have questions:
1. Check existing issues and discussions
2. Read the documentation
3. Ask in GitHub Discussions
4. Contact maintainers

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing! 🙏
