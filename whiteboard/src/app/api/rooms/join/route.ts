import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> },
) {
  try {
    const { roomCode } = await params;
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!roomCode) {
      return NextResponse.json(
        { error: "Room code is required" },
        { status: 400 },
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the room
    const room = await prisma.rooms.findFirst({
      where: { roomCode: roomCode.toUpperCase() },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Room not found or inactive" },
        { status: 404 },
      );
    }

    // Add user to participants if not already a member
    const existing = await prisma.roomParticipant.findFirst({
      where: { roomId: room.id, userId: user.id },
    });
    if (!existing) {
      await prisma.roomParticipant.create({
        data: { roomId: room.id, userId: user.id, joinedAt: new Date() },
      });
    } else {
      await prisma.roomParticipant.updateMany({
        where: { roomId: room.id, userId: user.id },
        data: { joinedAt: new Date() },
      });
    }

    // Fetch updated room with users
    const roomWithUsers = await prisma.rooms.findUnique({
      where: { id: room.id },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(roomWithUsers);
  } catch (error) {
    console.error("Error joining room:", error);
    return NextResponse.json({ error: "Failed to join room" }, { status: 500 });
  }
}
