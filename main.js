/* ==========================================================
   포트폴리오 — 스크롤 동작
   1) 섹션이 화면에 들어오면 부드럽게 나타나기
   2) 현재 보고 있는 섹션의 네비 링크에 밑줄 표시
   JS가 꺼져 있거나 실패해도 내용은 전부 그대로 보입니다.
   ========================================================== */
(function () {
  'use strict';

  var reveals = document.querySelectorAll('.reveal');
  var navLinks = document.querySelectorAll('.nav-links a');

  // IntersectionObserver를 못 쓰는 오래된 브라우저 → 전부 그냥 보여주고 끝
  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < reveals.length; i++) reveals[i].classList.add('in');
    return;
  }

  /* --- 1) 등장 애니메이션 --- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);   // 한 번 나타나면 다시 숨기지 않음
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  reveals.forEach(function (el) { revealObserver.observe(el); });

  /* --- 2) 네비 활성화 (스크롤 스파이) --- */
  // 네비 링크가 가리키는 섹션만 모은다
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href');
    if (!id || id.charAt(0) !== '#') return;
    var section = document.querySelector(id);
    if (section) sections.push({ el: section, link: link });
  });

  if (!sections.length) return;

  function setActive(link) {
    navLinks.forEach(function (a) { a.classList.remove('active'); });
    if (link) link.classList.add('active');
  }

  var visible = {};

  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      visible[entry.target.id] = entry.isIntersecting;
    });

    // 화면에 걸쳐 있는 섹션 중 가장 위쪽 것을 현재 섹션으로 본다
    for (var i = 0; i < sections.length; i++) {
      if (visible[sections[i].el.id]) {
        setActive(sections[i].link);
        return;
      }
    }
  }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });

  sections.forEach(function (s) { spyObserver.observe(s.el); });

  // 맨 아래까지 스크롤하면 마지막 섹션을 활성화 (짧은 마지막 섹션 대응)
  window.addEventListener('scroll', function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      setActive(sections[sections.length - 1].link);
    }
  }, { passive: true });
})();
