import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AmieService {
  constructor(private prisma: PrismaService) {}

  /**
   * Busca una institución educativa por código AMIE
   * Por ahora retorna datos mock, pero aquí se puede integrar
   * con una base de datos externa o servicio de consulta
   */
  async findByCode(code: string): Promise<{ amie: string; schoolName: string }> {
    // TODO: Implementar consulta real a base de datos de instituciones
    // Por ahora retornamos un mock para desarrollo
    
    // Ejemplo de cómo sería con una tabla de schools:
    // const school = await this.prisma.school.findUnique({
    //   where: { amie: code },
    // });
    
    // if (!school) {
    //   throw new NotFoundException(`Institución con código AMIE ${code} no encontrada`);
    // }
    
    // return {
    //   amie: school.amie,
    //   schoolName: school.name,
    // };

    // Mock temporal para desarrollo
    // En producción, esto debe consultar la base de datos real
    throw new NotFoundException(
      `Institución con código AMIE ${code} no encontrada. Por favor, ingrese el nombre manualmente.`,
    );
  }
}
