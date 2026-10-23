// 問い合わせ先。アドレスの形でソースや HTML に残さないよう、分けて持ち、符号化して埋め込む。
const CONTACT = { user: "info", domain: "xpenguin.biz" };

const reverse = (s: string) => [...s].reverse().join("");

/** 純粋: アドレスを、逆順にして base64 にした文字列に変える。 */
export function encodeMail(address: string): string {
  return btoa(reverse(address));
}

/** 純粋: encodeMail の逆。ブラウザ側でも使う。 */
export function decodeMail(code: string): string {
  return reverse(atob(code));
}

export function contactCode(): string {
  return encodeMail(`${CONTACT.user}@${CONTACT.domain}`);
}
