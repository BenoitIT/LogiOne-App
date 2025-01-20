import * as React from "react";

interface EmailTemplateProps {
  message: string;
}

export const EmailMessageTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  message,
}) => {
  return (
    <div style={{ width: "95%", maxWidth: "600px", margin: "auto" }}>
      <main
        style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <p style={{ textAlign: "left", color: "#718096", margin: "0 0 15px" }}>
          We trust this email finds you well.
        </p>
        <p
          style={{
            lineHeight: "1.75",
            color: "#718096",
            textAlign: "left",
            margin: "0 0 15px",
          }}
        >
          {message}
        </p>
        <p
          style={{
            lineHeight: "1.75",
            color: "#718096",
            textAlign: "left",
            margin: "0 0 15px",
          }}
        >
          We wish you a productive day.
        </p>
        <p
          style={{
            lineHeight: "1.75",
            color: "#718096",
            textAlign: "left",
            margin: "0 0 15px",
          }}
        >
          Best regards!
        </p>
      </main>
    </div>
  );
};
