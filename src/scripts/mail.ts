import { decodeMail } from "../lib/mail";

// data-mail を持つリンクは、操作されたときに初めて mailto: の href を組み立てる。
// 読み込んだだけでは HTML にアドレスが現れないので、クローラーに拾われにくい。
function reveal(a: HTMLAnchorElement) {
  if (a.dataset.revealed) return;
  const subject = a.dataset.subject ? `?subject=${encodeURIComponent(a.dataset.subject)}` : "";
  a.href = `mailto:${decodeMail(a.dataset.mail!)}${subject}`;
  a.dataset.revealed = "1";
}

const target = (e: Event) => (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-mail]");

for (const type of ["pointerdown", "focusin"]) {
  document.addEventListener(type, (e) => {
    const a = target(e);
    if (a) reveal(a);
  });
}
document.addEventListener("click", (e) => {
  const a = target(e);
  if (a) reveal(a);
});
