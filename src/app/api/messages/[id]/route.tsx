import prisma from "../../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { EmailMessageTemplate } from "@/appComponents/emailTemplates/message";
import { Resend } from "resend";
const resend = new Resend(process.env.NEXT_RESEND_API_KEY);
export const PUT = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const id = request.url.split("messages/")[1];
    if (id) {
      const message = await prisma.message.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (message) {
        const replyedMessage = await prisma.message.update({
          where: {
            id: Number(id),
          },
          data: {
            responded: true,
          },
        });
        if (message.email.length > 1) {
          const sendingAnemail = await resend.emails.send({
            from: "loginOneltd@loginOneltd.com",
            to: message.email,
            subject: "Message from loginOne LTD",
            react: EmailMessageTemplate({
              message: body.message,
            }),
            text: "Thank you for you message to us",
          });
          console.log(sendingAnemail);
        }
        return NextResponse.json({
          status: 200,
          data: replyedMessage,
          message: "Your response has been sent",
        });
      }
    }
  } catch (err) {
    console.log("eeerrr", err);
    return NextResponse.json({
      message: "unexpected issue occurs",
      status: 400,
    });
  }
};
