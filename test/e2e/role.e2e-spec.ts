import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { RoleController } from '../../src/api/role/role.controller';
import { RoleService } from '../../src/api/role/role.service';
import { AuthGuard } from '@nestjs/passport';

describe('RoleController (e2e)', () => {
  let app: INestApplication;
  const roleService = {
    findAll: jest.fn().mockResolvedValue([{ roleId: 1, roleName: 'admin' }]),
  } as Partial<RoleService>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [{ provide: RoleService, useValue: roleService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          req.user = { userId: '1', isAdmin: true };
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/roles (GET)', async () => {
    await request(app.getHttpServer())
      .get('/roles?filter=subjectId=1')
      .expect(200)
      .expect([{ roleId: 1, roleName: 'admin' }]);
    expect(roleService.findAll).toHaveBeenCalledWith(1);
  });
});
