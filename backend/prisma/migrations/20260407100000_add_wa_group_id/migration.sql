-- AlterTable
ALTER TABLE "Group" ADD COLUMN "whatsappGroupId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Group_whatsappGroupId_key" ON "Group"("whatsappGroupId");
