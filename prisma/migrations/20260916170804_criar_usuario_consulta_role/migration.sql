-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('ADMIN', 'MEDICO', 'PACIENTE') NOT NULL DEFAULT 'PACIENTE',

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Consulta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `especialidade` VARCHAR(100) NOT NULL,
    `dataConsulta` DATETIME(3) NOT NULL,
    `pacienteId` INTEGER NOT NULL,
    `medicoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Consulta` ADD CONSTRAINT `Consulta_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consulta` ADD CONSTRAINT `Consulta_medicoId_fkey` FOREIGN KEY (`medicoId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
