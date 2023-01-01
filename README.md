# Chalkboard

Chalkboard is a web application that combines the functionality of a code editor with a canvas for drawing and diagramming. It is designed for educators and developers who want to explain concepts through code and visuals. With Chalkboard, you can:

- Draw freehand, squares, text, and code editors on a canvas
- Log in to save and load canvases with OAuth authentication
- Execute code with the built-in code editors

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Rapid API / Judge0](https://api.judge0.com/)
- [Github OAuth](https://github.com/)
- [Amazon S3 Bucket](https://aws.amazon.com/s3/)

### Installation

1. Clone the repository

```bash
git clone https://github.com/<your-username>/chalkboard.git
```

2. Install dependencies

```bash
cd chalkboard
yarn
```

3. Create a .env file in the root of the project and add the following environment variables:

```
MONGODB_URI=
RAPIDAPI_KEY=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXTAUTH_URL=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET=
```

4. Start the development server

```bash
yarn dev
```

## Built with

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [Mongoose](https://mongoosejs.com/)
- [Monaco](https://microsoft.github.io/monaco-editor/)
- [Judge0 API](https://api.judge0.com/)
- [perfect-freehand](https://www.npmjs.com/package/perfect-freehand)
- [react-moveable](https://www.npmjs.com/package/react-moveable)
- [react-selecto](https://www.npmjs.com/package/react-selecto)
- [next-auth](https://next-auth.js.org/)
- [Material-UI](https://material-ui.com/)
- [react-color](https://casesandberg.github.io/react-color/)
- [zustand](https://github.com/react-spring/zustand)
- [Amazon S3](https://aws.amazon.com/s3/)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

