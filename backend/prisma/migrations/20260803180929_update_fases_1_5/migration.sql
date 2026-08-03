-- DropIndex
DROP INDEX "registros_horas_postulacion_id_semana_key";

-- AlterTable
ALTER TABLE "criterios_evaluacion" ADD COLUMN     "categoria" TEXT NOT NULL DEFAULT 'General',
ALTER COLUMN "peso" SET DEFAULT 11.11;

-- AlterTable
ALTER TABLE "documentos" ADD COLUMN     "cargado_por_id" TEXT,
ADD COLUMN     "nombre_interno" TEXT,
ALTER COLUMN "tipo" SET DEFAULT 'application/pdf';

-- AlterTable
ALTER TABLE "evaluaciones" ADD COLUMN     "aspectos_mejorar" TEXT,
ADD COLUMN     "fecha_envio" TIMESTAMP(3),
ADD COLUMN     "fortalezas" TEXT;

-- AlterTable
ALTER TABLE "registros_horas" ADD COLUMN     "actividad" TEXT NOT NULL DEFAULT 'Desarrollo de tareas asignadas',
ADD COLUMN     "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fecha_validacion" TIMESTAMP(3),
ADD COLUMN     "hora_entrada" TEXT NOT NULL DEFAULT '08:00',
ADD COLUMN     "hora_salida" TEXT NOT NULL DEFAULT '16:00',
ADD COLUMN     "horas_calculadas" DOUBLE PRECISION NOT NULL DEFAULT 7.0,
ADD COLUMN     "minutos_pausa" INTEGER NOT NULL DEFAULT 60,
ALTER COLUMN "semana" DROP NOT NULL,
ALTER COLUMN "horas_registradas" SET DEFAULT 7;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_cargado_por_id_fkey" FOREIGN KEY ("cargado_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
