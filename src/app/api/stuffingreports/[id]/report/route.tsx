import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

export const GET = async (req: Request) => {
    try {
        const stuffingreportId = req.url.split("stuffingreports/")[1][0];
        const stuffingreport = await prisma.stuffingreport.findFirst({
            where: {
                id: Number(stuffingreportId),
            }
        });
        if (stuffingreport) {
            return NextResponse.json({
                status: 200,
                data: stuffingreport,
            });
        }
        return NextResponse.json({
            status: 404,
            message: stuffingreport,
        });
    } catch (err) {
        return NextResponse.json({
            status: 400,
            message: "something went wrong",
        });
    }
};