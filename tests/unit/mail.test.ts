import { describe, expect, it } from "vitest";
import { contactCode, decodeMail, encodeMail } from "../../src/lib/mail";

describe("mail", () => {
  it("符号化したものを復号すると元に戻る", () => {
    expect(decodeMail(encodeMail("someone@example.com"))).toBe("someone@example.com");
  });
  it("符号化した文字列にアドレスの形が残らない", () => {
    const code = encodeMail("someone@example.com");
    expect(code).not.toContain("@");
    expect(code).not.toContain("example");
  });
  it("問い合わせ先は info@xpenguin.biz", () => {
    expect(decodeMail(contactCode())).toBe(["info", "xpenguin.biz"].join("@"));
  });
});
