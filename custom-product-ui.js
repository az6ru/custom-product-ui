// ========================================
// КОМПЛЕКСНЫЙ UI ФАЙЛ
// Объединяет: выбор материала, выбор размера, блок преимуществ
// ========================================

(function () {
  // Утилита: ожидание появления нужной product-option
  function waitOption(keyword) {
    const options = document.querySelectorAll('.js-product-option');
    for (const opt of options) {
      const label = opt.querySelector('.js-product-option-name');
      const select = opt.querySelector('select');
      if (label && select && label.textContent.trim().toLowerCase().includes(keyword)) {
        return { wrapper: opt, label, select };
      }
    }
    return null;
  }

  // ========================================
  // 1) КАСТОМНЫЙ ВЫБОР МАТЕРИАЛА
  // ========================================
  const materialMap = {
    'желтое золото': 'linear-gradient(45deg, #fdde6e 0%, #ffffff14 50%, #fdde6e 100%)',
    'белое золото': 'linear-gradient(45deg, #cecece 0%, #ffffff14 50%, #cecece 100%)',
  };
  function initMaterialSelector() {
    const found = waitOption('материал');
    if (!found) return;
    const { wrapper, select, label } = found;

    // Предотвращаем повторную инициализацию
    if (wrapper.querySelector('#custom-material-block')) return;

    label.style.display = 'none';
    const variant = wrapper.querySelector('.t-product__option-variants');
    if (variant) variant.style.display = 'none';
    select.style.display = 'none';

    const container = document.createElement('div');
    container.id = 'custom-material-block';
    container.className = 'custom-material-wrapper';

    container.innerHTML = `
      <div class="custom-material-label">Материал: <span id="materialName">${select.value}</span></div>
      <div class="custom-material-dots"></div>`;

    const dotsWrap = container.querySelector('.custom-material-dots');

    Array.from(select.options).forEach((opt) => {
      const dot = document.createElement('div');
      dot.className = 'material-dot';
      dot.dataset.value = opt.value;

      const inner = document.createElement('div');
      inner.className = 'material-dot-inner';
      inner.style.background = materialMap[opt.value] || '#eee';
      dot.appendChild(inner);
      if (opt.selected) dot.classList.add('active');

      dot.addEventListener('click', () => {
        select.value = opt.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        dotsWrap.querySelectorAll('.material-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        container.querySelector('#materialName').textContent = opt.value;
      });
      dotsWrap.appendChild(dot);
    });

    // Реакция на внешние изменения select
    select.addEventListener('change', () => {
      const val = select.value;
      container.querySelector('#materialName').textContent = val;
      dotsWrap.querySelectorAll('.material-dot').forEach(d => d.classList.toggle('active', d.dataset.value === val));
    });

    wrapper.prepend(container);
  }

  // ========================================
  // 2) КАСТОМНЫЙ ВЫБОР РАЗМЕРА
  // ========================================
  function initSizeSelector() {
    const found = waitOption('размер');
    if (!found) return;
    const { wrapper, select, label } = found;
    if (wrapper.querySelector('#custom-line-size-block')) return;

    label.style.display = 'none';
    const variant = wrapper.querySelector('.t-product__option-variants');
    if (variant) variant.style.display = 'none';
    select.style.display = 'none';

    const block = document.createElement('div');
    block.id = 'custom-line-size-block';
    block.className = 'custom-line-sizes';

    // Заголовок + ссылка
    block.innerHTML = `
      <div class="custom-line-sizes-header">
        <div class="custom-line-sizes-label">Размер</div>
        <a href="#sizeguide" class="custom-line-sizes-guide">Таблица размеров</a>
      </div>
      <div class="custom-line-sizes-row"></div>`;

    const row = block.querySelector('.custom-line-sizes-row');

    Array.from(select.options).forEach(opt => {
      const item = document.createElement('div');
      item.className = 'line-size';
      item.textContent = opt.value;
      item.dataset.value = opt.value;
      if (opt.disabled) item.classList.add('disabled');
      if (opt.selected) item.classList.add('active');

      item.addEventListener('click', () => {
        select.value = opt.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        row.querySelectorAll('.line-size').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
      });
      row.appendChild(item);
    });

    select.addEventListener('change', () => {
      const val = select.value;
      row.querySelectorAll('.line-size').forEach(el => el.classList.toggle('active', el.dataset.value === val));
    });

    wrapper.prepend(block);
  }

  // ========================================
  // 3) БЛОК ПРЕИМУЩЕСТВ + СТИЛИЗАЦИЯ КНОПКИ
  // ========================================
  function initBenefitsBlock() {
    const charcsBlock = document.querySelector('.js-store-prod-all-charcs');
    if (!charcsBlock || document.querySelector('.custom-benefit-block')) return;

    // Стилизуем кнопку, если она ещё не стилизована
    const buyBtn = document.querySelector('.t-store__prod-popup__btn-wrapper a');
    if (buyBtn && !buyBtn.classList.contains('styled-buy-btn')) {
      buyBtn.classList.add('styled-buy-btn');
      buyBtn.textContent = 'Добавить в корзину';
      buyBtn.style.cssText = `
        display: inline-block;
        padding: 14px 28px;
        border: 1px solid #121212;
        background-color: transparent;
        color: #121212;
        text-decoration: none;
        font-size: 13px;
        text-transform: uppercase;
        font-weight: 400;
        letter-spacing: 0.3px;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
        font-family: Roboto, sans-serif;
        transition: background 0.3s ease, color 0.3s ease;`;
      buyBtn.addEventListener('mouseenter', () => {
        buyBtn.style.backgroundColor = '#121212';
        buyBtn.style.color = '#fff';
      });
      buyBtn.addEventListener('mouseleave', () => {
        buyBtn.style.backgroundColor = 'transparent';
        buyBtn.style.color = '#121212';
      });
    }

    // Создаём блок преимуществ
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-benefit-block';
    wrapper.innerHTML = `
      <div class="link-group">
        <a href="https://wa.me/79771649500" target="_blank">Связаться с консультантом</a>
        <a href="#zeropopup1">Примерить в шоуруме</a>
      </div>
      <div class="delivery-info">
        <p>Все наши украшения очень важно примерить и почувствовать на себе, поэтому вы всегда можете оформить доставку с примеркой:</p>
        <ul>
          <li>Примерка по Москве — 700 ₽</li>
          <li>Бесплатная доставка по России — от 30 000 ₽</li>
          <li>Самовывоз бесплатно — Москва, Рождественский б-р 10/7</li>
          <li>Международная доставка — по согласованию</li>
        </ul>
      </div>`;

    charcsBlock.insertAdjacentElement('afterend', wrapper);
  }

  // ========================================
  // ИНИЦИАЛИЗАЦИЯ
  // ========================================
  function initAll() {
    initMaterialSelector();
    initSizeSelector();
    initBenefitsBlock();
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Первый запуск после полной загрузки DOM
    initAll();
    // Наблюдаем изменения DOM, чтобы реагировать на динамически загружаемый контент
    const observer = new MutationObserver(initAll);
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
