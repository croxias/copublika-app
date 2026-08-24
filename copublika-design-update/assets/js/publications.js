/* =====================================================
   CoPublika — Publications module
   Search, filter (quartile + year + cluster), sort, pagination
   ===================================================== */
(function () {
  'use strict';

  // ---------- Data ----------
  // q: q1 | q2 | q3 | sinta
  // c: edtech | health | circular | ai | policy | ling
  // y: year (number) ; m: month 1..12
  const MONTHS_ID = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const MONTHS_ID_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  const PUBS = [
    // ---------- 2025 ----------
    { y: 2025, m: 6, q: 'q1', c: 'edtech', title: 'Generative AI Adoption in Indonesian Higher Education: A National Survey of 12 Universities', authors: 'Putranto, A., Kartika, L., Nugroho, B.', journal: 'Journal of Educational Research' },
    { y: 2025, m: 6, q: 'q2', c: 'health', title: 'Digital Health Literacy Among Rural Indonesian Communities Post-COVID: A Mixed-Methods Study', authors: 'Rahmawati, M., Hidayat, A., Sari, D.', journal: 'Health Promotion International' },
    { y: 2025, m: 5, q: 'q1', c: 'circular', title: 'Circular Economy Practices in Central Java\u2019s Textile MSMEs: A Multi-Case Analysis', authors: 'Setiawan, B., Nirmala, D.', journal: 'Sustainability' },
    { y: 2025, m: 5, q: 'q1', c: 'edtech', title: 'Faculty Perception of ChatGPT in Grading: A Mixed-Methods Study at Three Indonesian Universities', authors: 'Kartika, L., Putranto, A., Suryanto, H.', journal: 'Computers & Education' },
    { y: 2025, m: 4, q: 'q2', c: 'ling', title: 'Anchor Sentences as a Heuristic for L2 Academic Writing: A Quasi-Experimental Study', authors: 'Nurhaliza, S., Kartika, L.', journal: 'Studies in Higher Education' },
    { y: 2025, m: 4, q: 'q3', c: 'ai', title: 'Algorithmic Accountability in Indonesian Public Service Delivery: A Stakeholder Mapping', authors: 'Pradana, R., Anggraeni, E.', journal: 'Information Polity' },
    { y: 2025, m: 4, q: 'q2', c: 'policy', title: 'Decentralization and Educational Outcomes: A 15-Province Panel Study, 2008\u20132022', authors: 'Suryanto, H., Wahyuni, N.', journal: 'World Development' },
    { y: 2025, m: 3, q: 'q1', c: 'health', title: 'Anxiety and Sleep Quality Among Indonesian Medical Residents: A Longitudinal Survey', authors: 'Rahmawati, M., Pratama, F.', journal: 'BMC Medical Education' },
    { y: 2025, m: 3, q: 'sinta', title: 'Pemanfaatan ChatGPT dalam Pembelajaran Sastra Indonesia di SMA: Studi Pendahuluan', authors: 'Putri, A. S., Wibowo, T.', journal: 'Litera', sinta: 'Sinta 2' },
    { y: 2025, m: 3, q: 'q3', c: 'circular', title: 'Plastic Waste Valorization in Coastal Bali: A Stakeholder Lens', authors: 'Maharani, R., Setiabudi, B.', journal: 'Resources, Conservation & Recycling Advances' },
    { y: 2025, m: 2, q: 'q1', c: 'edtech', title: 'Bayesian Methods for Modeling Self-Regulated Learning in Online Modality', authors: 'Tan, M. L., Nugroho, B.', journal: 'The Internet and Higher Education' },
    { y: 2025, m: 2, q: 'q2', c: 'ai', title: 'Trust Calibration in LLM-Assisted Clinical Decision Support: Evidence from Two Jakarta Hospitals', authors: 'Hidayat, A., Sari, D., Wijaya, K.', journal: 'JAMIA Open' },
    { y: 2025, m: 1, q: 'q3', c: 'health', title: 'Tuberculosis Treatment Adherence in Eastern Indonesia: A Health-Belief Model Study', authors: 'Pratama, F., Tirta, M.', journal: 'BMC Public Health' },
    { y: 2025, m: 1, q: 'sinta', title: 'Strategi Komunikasi Krisis Pemerintah Daerah di Era Pasca-Pandemi', authors: 'Anggraeni, E., Suryanto, H.', journal: 'Jurnal Komunikasi Indonesia', sinta: 'Sinta 1' },

    // ---------- 2024 ----------
    { y: 2024, m: 12, q: 'q1', c: 'policy', title: 'Network Effects in Early-Career Academic Writing Communities: A Social Capital Perspective', authors: 'Hidayat, A., Putranto, A., Rahmawati, M.', journal: 'Higher Education' },
    { y: 2024, m: 12, q: 'q3', c: 'ling', title: 'Reading Comprehension Strategies in English-Medium Instruction: Evidence from Indonesian Polytechnics', authors: 'Puspita, R., Ramadhan, F.', journal: 'TEFLIN Journal' },
    { y: 2024, m: 11, q: 'q2', c: 'edtech', title: 'Reviewer Comment Framing and Author Response: A Discourse Analysis of 240 Revision Letters', authors: 'Suryanto, H., Putranto, A.', journal: 'Learned Publishing' },
    { y: 2024, m: 11, q: 'sinta', title: 'Asesmen Otentik di Pendidikan Vokasi: Tantangan Implementasi Kurikulum Merdeka', authors: 'Kartika, L., Maharani, R.', journal: 'Cakrawala Pendidikan', sinta: 'Sinta 1' },
    { y: 2024, m: 10, q: 'q1', c: 'circular', title: 'Industrial Symbiosis in Indonesian Manufacturing Clusters: Barriers and Enablers', authors: 'Nirmala, D., Setiawan, B., Wijaya, K.', journal: 'Journal of Cleaner Production' },
    { y: 2024, m: 10, q: 'q2', c: 'ai', title: 'Fairness Audits for Indonesian Credit-Scoring Algorithms: A Replication Study', authors: 'Chen, F., Pradana, R.', journal: 'ACM Transactions on Computing for Healthcare' },
    { y: 2024, m: 9, q: 'q1', c: 'health', title: 'Maternal Mental Health and Infant Feeding Practices: A Cohort Study in Surabaya', authors: 'Rahmawati, M., Tirta, M.', journal: 'The Lancet Regional Health \u2014 Southeast Asia' },
    { y: 2024, m: 9, q: 'q2', c: 'policy', title: 'Public Trust in Pandemic Reporting: A Cross-Provincial Comparison', authors: 'Anggraeni, E., Wahyuni, N.', journal: 'Policy Sciences' },
    { y: 2024, m: 8, q: 'q3', c: 'edtech', title: 'Flipped Classroom in Engineering Education: A Two-Cohort Comparison at ITS', authors: 'Kurnia, H., Pratama, F.', journal: 'European Journal of Engineering Education' },
    { y: 2024, m: 8, q: 'sinta', title: 'Literasi Digital Guru Sekolah Dasar: Survei di 12 Kabupaten Jawa Tengah', authors: 'Wahyuni, N., Putri, A. S.', journal: 'Jurnal Pendidikan dan Pembelajaran', sinta: 'Sinta 2' },
    { y: 2024, m: 7, q: 'q2', c: 'circular', title: 'Consumer Willingness to Pay for Repaired Electronics in Urban Indonesia', authors: 'Setiawan, B., Yulianti, S.', journal: 'Journal of Consumer Research \u2014 Sustainability Issue' },
    { y: 2024, m: 7, q: 'q3', c: 'ling', title: 'Code-Switching in University Lectures: A Corpus Study of Five Indonesian Universities', authors: 'Nurhaliza, S., Rahman, A.', journal: 'World Englishes' },
    { y: 2024, m: 6, q: 'q1', c: 'edtech', title: 'Doctoral Supervision in the Online Modality: Voices from 60 Indonesian PhD Candidates', authors: 'Suryanto, H., Kartika, L.', journal: 'Studies in Higher Education' },
    { y: 2024, m: 6, q: 'q3', c: 'policy', title: 'Open Data Adoption in Indonesian Local Governments: A 50-City Audit', authors: 'Pradana, R., Anggraeni, E.', journal: 'Government Information Quarterly' },
    { y: 2024, m: 5, q: 'q2', c: 'health', title: 'Health Worker Burnout in District Hospitals: A Two-Year Follow-up Study', authors: 'Pratama, F., Hidayat, A.', journal: 'Human Resources for Health' },
    { y: 2024, m: 5, q: 'sinta', title: 'Pengaruh Mentoring Akademik terhadap Produktivitas Publikasi Dosen Pemula', authors: 'Putranto, A., Suryanto, H.', journal: 'Jurnal Pendidikan Tinggi', sinta: 'Sinta 1' },
    { y: 2024, m: 4, q: 'q1', c: 'ai', title: 'Federated Learning for Clinical NLP in Low-Resource Languages: An Indonesian Case', authors: 'Andersen, L., Hidayat, A., Chen, F.', journal: 'npj Digital Medicine' },
    { y: 2024, m: 3, q: 'q2', c: 'circular', title: 'Designing Take-Back Schemes for Coffee Capsules: A Discrete Choice Experiment', authors: 'Nirmala, D., Yulianti, S.', journal: 'Journal of Business Research' },
    { y: 2024, m: 2, q: 'q3', c: 'edtech', title: 'Peer Feedback Quality in Asynchronous Writing Courses: Evidence from Three Universities', authors: 'Kartika, L., Puspita, R.', journal: 'Assessing Writing' },

    // ---------- 2023 ----------
    { y: 2023, m: 12, q: 'q1', c: 'policy', title: 'Decentralization and Public Service Quality: A Synthetic Control Approach', authors: 'Wahyuni, N., Pradana, R.', journal: 'World Development' },
    { y: 2023, m: 11, q: 'q2', c: 'health', title: 'Cervical Cancer Screening Uptake Among Urban Indonesian Women: A Theory-Based Survey', authors: 'Rahmawati, M., Sari, D.', journal: 'Vaccine' },
    { y: 2023, m: 10, q: 'q3', c: 'ling', title: 'Anxiety in English Public Speaking: A Mixed-Methods Study in Indonesian Polytechnics', authors: 'Puspita, R., Nurhaliza, S.', journal: 'TESOL Journal' },
    { y: 2023, m: 10, q: 'sinta', title: 'Kualitas Pelayanan Publik di Era Digital: Studi pada Lima Pemerintah Daerah', authors: 'Pradana, R., Anggraeni, E.', journal: 'Jurnal Administrasi Publik', sinta: 'Sinta 2' },
    { y: 2023, m: 9, q: 'q1', c: 'edtech', title: 'Heterogeneous Effects of Mentor Matching in Doctoral Programs: Evidence from a Field Experiment', authors: 'Putranto, A., Tan, M. L.', journal: 'Research Policy' },
    { y: 2023, m: 8, q: 'q2', c: 'ai', title: 'Explainable AI in Loan Decisioning: An Audit of Three Indonesian Fintech Platforms', authors: 'Chen, F., Pradana, R.', journal: 'AI & Society' },
    { y: 2023, m: 7, q: 'q3', c: 'circular', title: 'Plastic Bag Bans in Jakarta: Compliance and Behavioral Spillovers', authors: 'Setiabudi, B., Wijaya, K.', journal: 'Environmental Science & Policy' },
    { y: 2023, m: 6, q: 'q2', c: 'edtech', title: 'Self-Compassion and Academic Procrastination: A Daily Diary Study', authors: 'Yulianti, S., Maharani, R.', journal: 'Personality and Individual Differences' },
    { y: 2023, m: 5, q: 'q3', c: 'health', title: 'Diabetes Self-Management Among Older Adults: A Community-Based Cluster Trial', authors: 'Tirta, M., Pratama, F.', journal: 'Patient Education and Counseling' },
    { y: 2023, m: 4, q: 'sinta', title: 'Persepsi Mahasiswa terhadap Kebijakan Kampus Merdeka: Studi Lima PTN', authors: 'Maharani, R., Putranto, A.', journal: 'Jurnal Ilmu Pendidikan', sinta: 'Sinta 1' },
    { y: 2023, m: 3, q: 'q1', c: 'policy', title: 'Information Disclosure and Public Trust: An Experimental Study During the Pandemic', authors: 'Anggraeni, E., Suryanto, H.', journal: 'Public Administration Review' },

    // ---------- 2022 ----------
    { y: 2022, m: 12, q: 'q2', c: 'ling', title: 'Translanguaging in Indonesian EMI Classrooms: A Multi-Site Ethnography', authors: 'Nurhaliza, S., Rahman, A.', journal: 'International Journal of Bilingual Education and Bilingualism' },
    { y: 2022, m: 11, q: 'q1', c: 'circular', title: 'Refurbishment Markets for Mobile Phones: A Cross-Country Comparison', authors: 'Nirmala, D., Yulianti, S.', journal: 'Journal of Industrial Ecology' },
    { y: 2022, m: 9, q: 'q3', c: 'edtech', title: 'Learning Analytics Adoption in Indonesian Universities: A Readiness Assessment', authors: 'Nugroho, B., Kartika, L.', journal: 'British Journal of Educational Technology' },
    { y: 2022, m: 8, q: 'sinta', title: 'Model Bisnis Sirkular pada UMKM Tekstil: Studi Kasus di Bandung Raya', authors: 'Setiawan, B., Nirmala, D.', journal: 'Jurnal Manajemen dan Kewirausahaan', sinta: 'Sinta 2' },
    { y: 2022, m: 7, q: 'q2', c: 'health', title: 'Vaccine Hesitancy in Indonesian Urban Mothers: A Mixed-Methods Study', authors: 'Sari, D., Rahmawati, M.', journal: 'Vaccine' },
    { y: 2022, m: 5, q: 'q3', c: 'ai', title: 'Bias in Indonesian Sentiment Analysis Models: A Resource Audit', authors: 'Chen, F., Pradana, R.', journal: 'Natural Language Engineering' },
    { y: 2022, m: 3, q: 'q1', c: 'edtech', title: 'Co-Authoring Pipelines in Indonesian Higher Education: A Bibliometric Network Analysis', authors: 'Putranto, A., Nugroho, B., Tan, M. L.', journal: 'Scientometrics' },
    { y: 2022, m: 2, q: 'sinta', title: 'Pengembangan Instrumen Pengukuran Literasi AI Mahasiswa', authors: 'Kartika, L., Wahyuni, N.', journal: 'Jurnal Penelitian dan Evaluasi Pendidikan', sinta: 'Sinta 1' }
  ];

  // ---------- State ----------
  const PER_PAGE = 8;
  let state = {
    q: 'all',           // quartile
    y: 'all',           // year
    c: 'all',           // cluster
    sort: 'newest',     // newest | oldest | title
    search: '',
    page: 1
  };

  // ---------- DOM ----------
  const $list = document.getElementById('pubList');
  const $empty = document.getElementById('pubsEmpty');
  const $count = document.getElementById('pubsCount');
  const $pag = document.getElementById('pubsPagination');
  const $searchInput = document.getElementById('pubsSearch');
  const $searchWrap = document.getElementById('pubsSearchWrap');
  const $clear = document.getElementById('pubsClear');
  const $sort = document.getElementById('pubsSort');
  const $indexFilter = document.getElementById('indexFilter');
  const $yearFilter = document.getElementById('yearFilter');
  const $clusterFilter = document.getElementById('clusterFilter');

  if (!$list) return; // not on this page

  // ---------- Helpers ----------
  function quartileLabel(p) {
    if (p.q === 'q1') return { cls: '', label: 'Scopus Q1' };
    if (p.q === 'q2') return { cls: 'q2', label: 'Scopus Q2' };
    if (p.q === 'q3') return { cls: 'q3', label: 'Scopus Q3' };
    return { cls: 'sinta', label: p.sinta || 'Sinta' };
  }

  function dateLabel(p) {
    return `${MONTHS_ID[p.m - 1]} ${p.y}`;
  }

  function dateShort(p) {
    return `${MONTHS_ID_SHORT[p.m - 1]} ${p.y}`;
  }

  function applyFilters() {
    return PUBS.filter(p => {
      if (state.q !== 'all' && p.q !== state.q) return false;
      if (state.y !== 'all' && String(p.y) !== state.y) return false;
      if (state.c !== 'all' && p.c !== state.c) return false;
      if (state.search) {
        const hay = (p.title + ' ' + p.authors + ' ' + p.journal).toLowerCase();
        if (!hay.includes(state.search)) return false;
      }
      return true;
    });
  }

  function sortList(arr) {
    const a = arr.slice();
    if (state.sort === 'newest') {
      a.sort((x, y) => (y.y - x.y) || (y.m - x.m));
    } else if (state.sort === 'oldest') {
      a.sort((x, y) => (x.y - y.y) || (x.m - y.m));
    } else if (state.sort === 'title') {
      a.sort((x, y) => x.title.localeCompare(y.title));
    }
    return a;
  }

  // ---------- Render ----------
  function renderList() {
    const filtered = sortList(applyFilters());
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * PER_PAGE;
    const slice = filtered.slice(start, start + PER_PAGE);

    // Empty
    if (total === 0) {
      $list.innerHTML = '';
      $list.style.display = 'none';
      $empty.style.display = 'block';
      $pag.innerHTML = '';
      $count.innerHTML = 'Tidak ada hasil';
      return;
    }
    $list.style.display = '';
    $empty.style.display = 'none';

    // Rows
    $list.innerHTML = slice.map(p => {
      const ql = quartileLabel(p);
      return `
        <div class="pub" tabindex="0">
          <div class="date">${dateShort(p)}</div>
          <div>
            <div class="title">${escapeHtml(p.title)}</div>
            <div class="authors">${escapeHtml(p.authors)}</div>
            <div class="topic">${clusterLabel(p.c)}</div>
          </div>
          <div class="journal">${escapeHtml(p.journal)}</div>
          <div class="quartile ${ql.cls}">${ql.label}</div>
        </div>
      `;
    }).join('');

    // Count
    const a = start + 1;
    const b = Math.min(start + PER_PAGE, total);
    $count.innerHTML = `Menampilkan <strong>${a}\u2013${b}</strong> dari <strong>${total}</strong> publikasi`;

    // Pagination
    renderPagination(state.page, totalPages);
  }

  function clusterLabel(c) {
    return ({
      edtech: 'Pendidikan & EdTech',
      health: 'Kesehatan',
      circular: 'Ekonomi Sirkular',
      ai: 'AI & Etika',
      policy: 'Kebijakan Publik',
      ling: 'Linguistik'
    })[c] || c;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  function renderPagination(current, total) {
    if (total <= 1) {
      $pag.innerHTML = `<div class="page-info">Halaman <strong>1</strong> dari <strong>1</strong></div>`;
      return;
    }
    const pages = pageNumbers(current, total);
    const btns = pages.map(p => {
      if (p === '…') return `<span class="page-ellipsis">…</span>`;
      return `<button class="page-btn ${p === current ? 'active' : ''}" data-p="${p}">${p}</button>`;
    }).join('');

    $pag.innerHTML = `
      <div class="page-info">Halaman <strong>${current}</strong> dari <strong>${total}</strong></div>
      <div class="page-controls">
        <button class="page-btn nav-btn" data-p="prev" ${current === 1 ? 'disabled' : ''}>← Sebelumnya</button>
        ${btns}
        <button class="page-btn nav-btn" data-p="next" ${current === total ? 'disabled' : ''}>Berikutnya →</button>
      </div>
    `;
  }

  function pageNumbers(current, total) {
    // Compact: 1 … (c-1) c (c+1) … total
    const result = new Set([1, total, current, current - 1, current + 1]);
    const sorted = [...result].filter(n => n >= 1 && n <= total).sort((a, b) => a - b);
    const out = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push('…');
      out.push(sorted[i]);
    }
    return out;
  }

  // ---------- Update rail counts from data ----------
  function refreshRailCounts() {
    // index counts (within current year+cluster+search)
    const baseExceptQ = PUBS.filter(p => {
      if (state.y !== 'all' && String(p.y) !== state.y) return false;
      if (state.c !== 'all' && p.c !== state.c) return false;
      if (state.search) {
        const hay = (p.title + ' ' + p.authors + ' ' + p.journal).toLowerCase();
        if (!hay.includes(state.search)) return false;
      }
      return true;
    });
    setCount($indexFilter, 'all', baseExceptQ.length);
    setCount($indexFilter, 'q1', baseExceptQ.filter(p => p.q === 'q1').length);
    setCount($indexFilter, 'q2', baseExceptQ.filter(p => p.q === 'q2').length);
    setCount($indexFilter, 'q3', baseExceptQ.filter(p => p.q === 'q3').length);
    setCount($indexFilter, 'sinta', baseExceptQ.filter(p => p.q === 'sinta').length);

    // year counts (within current q+cluster+search)
    const baseExceptY = PUBS.filter(p => {
      if (state.q !== 'all' && p.q !== state.q) return false;
      if (state.c !== 'all' && p.c !== state.c) return false;
      if (state.search) {
        const hay = (p.title + ' ' + p.authors + ' ' + p.journal).toLowerCase();
        if (!hay.includes(state.search)) return false;
      }
      return true;
    });
    setCount($yearFilter, 'all', baseExceptY.length);
    [2025, 2024, 2023, 2022].forEach(y => {
      setCount($yearFilter, String(y), baseExceptY.filter(p => p.y === y).length);
    });
  }

  function setCount(scope, key, count) {
    if (!scope) return;
    const sel = scope === $indexFilter ? `[data-f="${key}"]` : `[data-y="${key}"]`;
    const el = scope.querySelector(sel);
    if (!el) return;
    let ct = el.querySelector('.ct');
    if (count === 0 && key !== 'all') {
      if (ct) ct.textContent = '0';
      el.style.opacity = '0.4';
      el.style.pointerEvents = 'none';
    } else {
      if (ct) ct.textContent = count;
      el.style.opacity = '';
      el.style.pointerEvents = '';
    }
  }

  // ---------- Bind ----------
  function setActive(scope, attr, value) {
    scope.querySelectorAll('.rail-opt').forEach(b => {
      b.classList.toggle('active', b.dataset[attr] === value);
    });
  }

  $indexFilter && $indexFilter.addEventListener('click', e => {
    const b = e.target.closest('.rail-opt');
    if (!b) return;
    state.q = b.dataset.f;
    state.page = 1;
    setActive($indexFilter, 'f', state.q);
    refreshRailCounts();
    renderList();
  });

  $yearFilter && $yearFilter.addEventListener('click', e => {
    const b = e.target.closest('.rail-opt');
    if (!b) return;
    state.y = b.dataset.y;
    state.page = 1;
    setActive($yearFilter, 'y', state.y);
    refreshRailCounts();
    renderList();
  });

  $clusterFilter && $clusterFilter.addEventListener('click', e => {
    const b = e.target.closest('.rail-opt');
    if (!b) return;
    state.c = b.dataset.c;
    state.page = 1;
    setActive($clusterFilter, 'c', state.c);
    refreshRailCounts();
    renderList();
  });

  let searchTimer;
  $searchInput && $searchInput.addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.search = e.target.value.trim().toLowerCase();
      state.page = 1;
      $searchWrap.classList.toggle('has-query', !!state.search);
      refreshRailCounts();
      renderList();
    }, 150);
  });

  $clear && $clear.addEventListener('click', () => {
    $searchInput.value = '';
    state.search = '';
    state.page = 1;
    $searchWrap.classList.remove('has-query');
    refreshRailCounts();
    renderList();
    $searchInput.focus();
  });

  $sort && $sort.addEventListener('change', e => {
    state.sort = e.target.value;
    renderList();
  });

  $pag && $pag.addEventListener('click', e => {
    const b = e.target.closest('.page-btn');
    if (!b || b.disabled) return;
    const p = b.dataset.p;
    const filtered = applyFilters();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    if (p === 'prev') state.page = Math.max(1, state.page - 1);
    else if (p === 'next') state.page = Math.min(totalPages, state.page + 1);
    else state.page = parseInt(p, 10);
    renderList();
    // Scroll pubs into view (gentle)
    const pubSection = document.getElementById('publications');
    if (pubSection) {
      const y = pubSection.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });

  // ---------- Initial render ----------
  refreshRailCounts();
  renderList();
})();
