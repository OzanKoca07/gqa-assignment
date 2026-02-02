import { execSync } from "node:child_process";

beforeAll(() => {
  // migrate deploy (db şeması hazır olsun)
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
});

beforeEach(() => {
  // Her testten önce temiz DB istersen:
  // Eğer çok yavaş gelirse bunu beforeAll’a alıp tek kez seedleyebilirsin.
  try {
    execSync("npx prisma db execute --stdin <<'SQL'\n" +
      "DO $$ DECLARE r RECORD;\n" +
      "BEGIN\n" +
      "  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP\n" +
      "    EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';\n" +
      "  END LOOP;\n" +
      "END $$;\n" +
      "SQL", { stdio: "inherit", shell: "/bin/bash" as any });
  } catch {
    // Windows/cmd’de shell heredoc sorun çıkarabilir.
    // O durumda bu dosyayı "db cleanup" olmadan kullanıp testleri sırayla ilerlet.
  }
});
