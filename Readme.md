# PracIn

**PracIn: Your AI-powered gateway to ace DSA interviews with confidence.**

PracIn is designed for students preparing for product-based company interviews. It helps them not just solve problems but also articulate their approach confidently — the way it’s expected in a real technical interview.

## Inspiration

Many students practice coding on platforms like LeetCode or Codeforces but face challenges when asked to explain their solutions during actual interviews. They often get nervous, forget important points, or struggle to communicate their thought process clearly. PracIn was created to help students simulate this crucial part of the interview — explaining their approach confidently — so they can give their final shot with full preparation.

## What it does

- Provides a DSA interview simulation platform where users solve questions and explain their thought process.
- Uses speech-to-text to transcribe spoken explanations using Azure Cognitive Services.
- Integrates Azure OpenAI to provide AI-generated feedback on the user’s explanation.
- Includes a built-in code editor (Monaco) to write and test code.
- Uses Azure Database to store user login credentials securely.
- GitHub Copilot is used throughout the development process for writing and understanding code faster.

## How we built it

- **Frontend**: Built using ReactJS for a responsive, interactive interface.
- **Backend**: Developed with Python using Flask for handling routes, API requests, and Azure service integration.
- **Code Editor**: Integrated Monaco Editor for a smooth, in-browser coding experience.
- **Speech Recognition**: Implemented with Azure Cognitive Services for accurate speech-to-text functionality.
- **AI Feedback Bot**: Used Azure OpenAI Service to analyze user explanations and provide feedback.
- **Database**: Azure Database was used to manage user registration and authentication securely.
- **GitHub Copilot**: Assisted us in both frontend and backend implementation, debugging, and understanding Azure service integration.

## Challenges we ran into

- Azure OpenAI tokens were limited under the student subscription, making it difficult to test and iterate the app fully.
- Reviewing user-submitted code with Azure OpenAI was not possible due to free-tier restrictions.
- Speech-to-text accuracy needed tuning to handle variations in pronunciation and accents.
- Understanding and connecting multiple Azure services took time. GitHub Copilot was heavily used to bridge this learning gap.
- Real-time integration of speech input, AI feedback, and coding flow posed architectural and synchronization challenges.

## Accomplishments that we're proud of

- Successfully created a platform that goes beyond code submission and helps students practice interview-style explanations.
- Managed to use Azure OpenAI, Cognitive Services, and database features within the limits of a student account.
- GitHub Copilot significantly accelerated our development process and made it easier to explore new tools and integrations.
- Built a seamless React + Flask full-stack app with multi-modal Azure AI capabilities.

## What we learned

- Hands-on experience with Azure AI services, including OpenAI and Cognitive Speech Services.
- The importance of communication skills in technical interviews and how AI can help students improve.
- Efficient use of GitHub Copilot for full-stack development, learning best practices, and error debugging.
- Building a product end-to-end, from UI to backend to AI integration, within cloud limitations.

## What's next for PracIn

- Add peer-to-peer mock interview scheduling features.
- Integrate live feedback from mentors or interviewers along with AI feedback.
- Expand into HR and system design interview practice.
- Create a community-driven leaderboard and discussion forum.
- Develop a mobile-friendly version of the platform.


## Testing Instructions

To test the PracIn application locally or in a development environment, follow the steps below:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/PracIn.git
cd PracIn
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

### 3. Backend

Then in another terminal

```bash
cd allBackends
python3 app.py
```