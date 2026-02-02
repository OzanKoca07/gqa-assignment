import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

// yardımcı: unique
const uid = () => Math.random().toString(16).slice(2);

describe("GQA API (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("happy path: study -> templates -> subject -> schedule -> submission", async () => {
    const protocolCode = `P-${uid()}`;

    // 1) create study
    const studyRes = await request(app.getHttpServer())
      .post("/studies")
      .send({ name: "Study A", protocolCode })
      .expect(201);

    const studyId = studyRes.body.id;
    expect(studyId).toBeTruthy();

    // 2) create visit template
    const visitRes = await request(app.getHttpServer())
      .post(`/studies/${studyId}/visit-templates`)
      .send({ name: "V1", code: "V1", day: 1, windowBefore: 0, windowAfter: 0 })
      .expect(201);

    const visitTemplateId = visitRes.body.id;
    expect(visitTemplateId).toBeTruthy();

    // 3) create form template
    const formRes = await request(app.getHttpServer())
      .post(`/studies/${studyId}/form-templates`)
      .send({ name: "Vitals", code: `VITALS-${uid()}` })
      .expect(201);

    const formTemplateId = formRes.body.id;
    expect(formTemplateId).toBeTruthy();

    // 4) add field
    const fieldRes = await request(app.getHttpServer())
      .post(`/studies/${studyId}/form-templates/${formTemplateId}/fields`)
      .send({ label: "Temperature", key: `temp_${uid()}`, type: "NUMBER", order: 1, required: true })
      .expect(201);

    const fieldId = fieldRes.body.id;
    expect(fieldId).toBeTruthy();

    // 5) attach form to visit template
    await request(app.getHttpServer())
      .post(`/studies/${studyId}/visit-templates/${visitTemplateId}/forms`)
      .send({ formTemplateId })
      .expect(201);

    // 6) create subject
    const subjectCode = `SUBJ-${uid()}`;
    const subjRes = await request(app.getHttpServer())
      .post(`/studies/${studyId}/subjects`)
      .send({ subjectCode, enrollmentDate: new Date("2026-02-01").toISOString() })
      .expect(201);

    const subjectId = subjRes.body.id;
    expect(subjectId).toBeTruthy();

    // 7) generate scheduled visits
    const genRes = await request(app.getHttpServer())
      .post(`/studies/${studyId}/subjects/${subjectId}/scheduled-visits/generate`)
      .send({})
      .expect(201);

    // backend tek obje döndürebilir / array döndürebilir
    const generated = Array.isArray(genRes.body) ? genRes.body : [genRes.body];
    expect(generated.length).toBeGreaterThan(0);

    const scheduledVisitId = generated[0].id;
    expect(scheduledVisitId).toBeTruthy();

    // 8) submit form
    await request(app.getHttpServer())
      .post(
        `/studies/${studyId}/subjects/${subjectId}/scheduled-visits/${scheduledVisitId}/forms/${formTemplateId}/submissions`,
      )
      .send({
        values: [{ formFieldId: fieldId, valueNumber: 37.2 }],
      })
      .expect(201);

    // 9) list submissions
    const subsRes = await request(app.getHttpServer())
      .get(`/studies/${studyId}/subjects/${subjectId}/scheduled-visits/${scheduledVisitId}/submissions`)
      .expect(200);

    const subs = Array.isArray(subsRes.body) ? subsRes.body : [subsRes.body];
    expect(subs.length).toBeGreaterThan(0);
  });
});
