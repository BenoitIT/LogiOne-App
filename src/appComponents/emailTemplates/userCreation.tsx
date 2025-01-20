import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  email: string;
  password: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  email,
  password,
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
        <h2 style={{ color: "#2A5568", textAlign: "left", margin: "0 0 15px" }}>
          Dear {firstName},
        </h2>
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
          This serves to notify you that an account has been created for you on
          Super International Freight Services LTD shipping platform.
        </p>
        <p
          style={{
            lineHeight: "1.75",
            color: "#718096",
            textAlign: "left",
            margin: "0 0 15px",
          }}
        >
          The purpose of the platform is to improve service delivery to our
          clients.
        </p>
        <p
          style={{
            lineHeight: "1.75",
            color: "#718096",
            textAlign: "left",
            margin: "0 0 15px",
          }}
        >
          Kindly find credentials (email and password) to use while serving our
          clients within platform.
        </p>
        <p style={{ color: "#718096", textAlign: "left", margin: "0 0 10px" }}>
          1. Email: <b>{email}</b>
        </p>
        <p style={{ color: "#718096", textAlign: "left", margin: "0 0 10px" }}>
          2.Password <b>{password}</b>
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
