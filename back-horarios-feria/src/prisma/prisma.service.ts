import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL no está configurada');
    }

    console.log('Configurando conexión a la base de datos...');
    console.log('DATABASE_URL:', databaseUrl.replace(/:[^:@]+@/, ':****@')); // Ocultar password en logs

    // Prisma 7: Requiere usar un adapter
    // Configurar Pool con opciones más robustas
    const pool = new Pool({
      connectionString: databaseUrl,
      max: 10, // Máximo de conexiones en el pool
      idleTimeoutMillis: 30000, // Tiempo antes de cerrar conexiones inactivas
      connectionTimeoutMillis: 10000, // Timeout para establecer conexión
      // Forzar IPv4 si hay problemas con IPv6
      // Esto puede ayudar con ENETUNREACH
    });

    // Manejar errores del pool
    pool.on('error', (err) => {
      console.error('❌ Error inesperado en el pool de conexiones:', err);
    });

    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    try {
      console.log('Conectando a la base de datos...');
      await this.$connect();
      console.log('✅ Conexión a la base de datos establecida correctamente');
      
      // Verificar que la conexión funciona haciendo una consulta simple
      try {
        await this.$queryRaw`SELECT 1`;
        console.log('✅ Verificación de conexión exitosa');
      } catch (verifyError) {
        console.error('⚠️ Advertencia: La conexión se estableció pero la verificación falló:', verifyError);
      }
    } catch (error) {
      console.error('❌ Error al conectar a la base de datos:', error);
      console.error('Detalles del error:', {
        message: error.message,
        code: error.code,
        name: error.name,
      });
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
