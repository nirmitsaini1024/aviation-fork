export const formatExternalAnswers = (answers) => {
    if (!answers || !Array.isArray(answers)) return "";

    return answers
      .map(
        (item) => `#### ${item.title}

${item.content}

`
      )
      .join("\n");
  };


export const formatExternalAnswersInHTML = (answers) => {
  if (!answers || !Array.isArray(answers)) return "";
  
  const content = answers
    .map(
      (item) => `<h3>${item.title}</h3><p>${item.content}</p>`
    )
    .join("");
    
  return `
    <div class="external-answers">
      <style>
        .external-answers {
          margin: 20px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .external-answers h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 24px 0 12px 0;
          line-height: 1.4;
          
          padding-bottom: 8px;
        }

        .external-answers h3:first-child {
          margin-top: 0;
        }

        .external-answers p {
          font-size: 1rem;
          line-height: 1.6;
          color: #374151;
          margin: 0 0 20px 0;
          text-align: justify;
        }

        .external-answers p:last-child {
          margin-bottom: 0;
        }
      </style>
      ${content}
    </div>
  `;
};

export const formatExternalAnswersAsPlainText = (answers) => {
  if (!answers || !Array.isArray(answers)) return "";

  const content = answers.map(item =>
    `${item.title}\n${item.content}\n\n`
  ).join("\n");

  return content;
};
