(function(){
  const storageKey = 'studEvents.profile.v1';
  const defaults = {
    fullName: 'Розенко Елизавета Максимовна',
    faculty: 'ФАИТ',
    group: 'ИТ-23',
    email: 'emr032005@mail.ru',
    phone: '+7 (960) 621-76-28',
    birth: '2005-03-11'
  };

  const openButton = document.getElementById('profileEditButton');
  const modal = document.getElementById('profileModal');
  const overlay = document.getElementById('profileModalOverlay');
  const form = document.getElementById('profileForm');
  if(!openButton || !modal || !overlay || !form) return;

  const closeButton = document.getElementById('profileModalClose');
  const cancelButton = document.getElementById('profileCancel');
  const inputs = {
    fullName: document.getElementById('profileFullName'),
    faculty: document.getElementById('profileFaculty'),
    group: document.getElementById('profileGroup'),
    email: document.getElementById('profileEmail'),
    phone: document.getElementById('phone'),
    birth: document.getElementById('profileBirth')
  };

  function loadProfile(){
    try{
      const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
      return stored && typeof stored === 'object' ? { ...defaults, ...stored } : { ...defaults };
    }catch{
      return { ...defaults };
    }
  }

  function saveProfile(profile){
    try{
      localStorage.setItem(storageKey, JSON.stringify(profile));
      return true;
    }catch{
      return false;
    }
  }

  function pluralYears(age){
    const mod10 = age % 10;
    const mod100 = age % 100;
    if(mod10 === 1 && mod100 !== 11) return 'год';
    if(mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'года';
    return 'лет';
  }

  function calcAge(isoDate){
    const birth = new Date(`${isoDate}T00:00:00`);
    if(Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const beforeBirthday = today.getMonth() < birth.getMonth()
      || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
    if(beforeBirthday) age -= 1;
    return age;
  }

  function formatBirth(isoDate){
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate || '');
    if(!match) return '';
    const age = calcAge(isoDate);
    const base = `${match[3]}.${match[2]}.${match[1]}`;
    return age === null ? base : `${base} (${age} ${pluralYears(age)})`;
  }

  function shortName(fullName){
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if(!parts.length) return '';
    const initials = parts.slice(1, 3).map(part => `${part.charAt(0).toUpperCase()}.`).join('');
    return initials ? `${parts[0]} ${initials}` : parts[0];
  }

  function render(profile){
    document.querySelectorAll('[data-profile-field]').forEach(element => {
      const field = element.dataset.profileField;
      element.textContent = field === 'birth' ? formatBirth(profile.birth) : profile[field];
    });

    const avatar = document.querySelector('[data-profile-avatar]');
    if(avatar) avatar.textContent = (profile.fullName.trim().split(/\s+/)[1] || profile.fullName).charAt(0).toUpperCase();

    const headerName = document.querySelector('[data-user-name]');
    if(headerName) headerName.textContent = shortName(profile.fullName);
  }

  function fillForm(profile){
    inputs.fullName.value = profile.fullName;
    inputs.group.value = profile.group;
    inputs.email.value = profile.email;
    inputs.phone.value = profile.phone;
    inputs.birth.value = profile.birth;
    inputs.faculty.value = profile.faculty;
    inputs.faculty.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function openModal(){
    fillForm(loadProfile());
    overlay.classList.add('open');
    modal.classList.add('open');
    inputs.fullName.focus();
  }

  function closeModal(){
    overlay.classList.remove('open');
    modal.classList.remove('open');
    openButton.focus();
  }

  function validate(values){
    if(values.fullName.split(/\s+/).filter(Boolean).length < 2) return 'Укажите фамилию и имя полностью.';
    if(!values.group) return 'Укажите учебную группу.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) return 'Проверьте адрес электронной почты.';
    if(values.phone.replace(/\D/g, '').length < 11) return 'Введите телефон полностью.';
    if(!values.birth) return 'Укажите дату рождения.';
    const age = calcAge(values.birth);
    if(age === null || age < 14 || age > 100) return 'Проверьте дату рождения.';
    return '';
  }

  form.addEventListener('submit', event => {
    event.preventDefault();

    const values = {
      fullName: inputs.fullName.value.trim().replace(/\s+/g, ' '),
      faculty: inputs.faculty.value,
      group: inputs.group.value.trim(),
      email: inputs.email.value.trim(),
      phone: inputs.phone.value.trim(),
      birth: inputs.birth.value
    };

    const problem = validate(values);
    if(problem){
      window.showOperationFeedback?.('warning', problem, modal);
      return;
    }

    if(!saveProfile(values)){
      window.showOperationFeedback?.('error', 'Не удалось сохранить профиль в этом браузере.', modal);
      return;
    }

    render(values);
    closeModal();
    window.showOperationFeedback?.('success', 'Данные профиля обновлены.');
  });

  openButton.addEventListener('click', openModal);
  [closeButton, cancelButton, overlay].forEach(element => element?.addEventListener('click', closeModal));
  document.addEventListener('keydown', event => {
    if(event.key === 'Escape' && modal.classList.contains('open') && !document.querySelector('.custom-select.open')) closeModal();
  });

  render(loadProfile());
})();