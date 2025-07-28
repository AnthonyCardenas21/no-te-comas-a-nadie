let left = ['🐺 Lobo', '🐐 Cabra', '🌽 Coles'];
let right = [];
let boat = [];
let boatOnLeft = true;
let selected = null;

const leftList = document.getElementById('left-list');
const rightList = document.getElementById('right-list');
const boatList = document.getElementById('boat-list');
const boatSide = document.getElementById('boat-side');
const moveBtn = document.getElementById('move-btn');
const resetBtn = document.getElementById('reset-btn');
const message = document.getElementById('message');

// Renderiza el juego
function render() {
  leftList.innerHTML = '';
  rightList.innerHTML = '';
  boatList.innerHTML = '';
  boatSide.textContent = boatOnLeft ? 'Izquierda' : 'Derecha';
  if (!checkWin()) message.textContent = '';

  // Orilla izquierda
  left.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    if (selected && selected.item === item && selected.place === 'left') li.classList.add('selected');
    li.onclick = () => select(item, 'left');
    leftList.appendChild(li);
  });

  // Orilla derecha
  right.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    if (selected && selected.item === item && selected.place === 'right') li.classList.add('selected');
    li.onclick = () => select(item, 'right');
    rightList.appendChild(li);
  });

  // Bote (máx 1 elemento)
  boatList.innerHTML = '';
  boat.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    if (selected && selected.item === item && selected.place === 'boat') li.classList.add('selected');
    li.onclick = () => select(item, 'boat');
    boatList.appendChild(li);
  });

  // Habilita o deshabilita mover bote
  moveBtn.disabled = (boat.length > 1);

  // Al ganar o perder, bloquea el movimiento
  if (checkLose() || checkWin()) {
    moveBtn.disabled = true;
  }

  // Mostrar mensaje de victoria animado
  if (checkWin()) {
    showWin();
  }
}

// Seleccionar/des-seleccionar animal u objeto
function select(item, place) {
  if (selected && selected.item === item && selected.place === place) {
    selected = null;
  } else {
    selected = { item, place };
  }
  render();
}

// Permite quitar animal del bote
boatList.onclick = function(e) {
  if (e.target.tagName === 'LI') {
    let idx = boat.indexOf(e.target.textContent);
    if (idx > -1) {
      if (boatOnLeft) {
        left.push(boat[idx]);
      } else {
        right.push(boat[idx]);
      }
      boat.splice(idx, 1);
      selected = null;
      render();
    }
  }
};
// Permite subir animal al bote (si está el bote y cabe)
leftList.onclick = function(e) {
  if (e.target.tagName === 'LI' && boatOnLeft && boat.length < 1) {
    let idx = left.indexOf(e.target.textContent);
    if (idx > -1) {
      boat.push(left[idx]);
      left.splice(idx, 1);
      selected = null;
      render();
    }
  }
};
rightList.onclick = function(e) {
  if (e.target.tagName === 'LI' && !boatOnLeft && boat.length < 1) {
    let idx = right.indexOf(e.target.textContent);
    if (idx > -1) {
      boat.push(right[idx]);
      right.splice(idx, 1);
      selected = null;
      render();
    }
  }
};

// Botón cruzar río
moveBtn.onclick = function() {
  if (boat.length > 1) {
    message.textContent = '¡Solo puedes llevar un animal en el bote!';
    return;
  }
  boatOnLeft = !boatOnLeft;
  message.textContent = '';
  render();
  if (checkLose()) {
    message.textContent = '💀 ¡Perdiste! Se comieron a alguien.';
    moveBtn.disabled = true;
  } else if (checkWin()) {
    showWin();
    moveBtn.disabled = true;
  }
};

function checkLose() {
  const side = boatOnLeft ? right : left;
  if (side.includes('🐐 Cabra') && side.includes('🐺 Lobo') && !side.includes('🌽 Coles')) {
    return true;
  }
  if (side.includes('🐐 Cabra') && side.includes('🌽 Coles') && !side.includes('🐺 Lobo')) {
    return true;
  }
  return false;
}

function checkWin() {
  return right.length === 3;
}

function showWin() {
  message.innerHTML = `
    <div class="win-popup">
      <div class="win-emoji">🏆</div>
      <div class="win-title">¡FELICIDADES!</div>
      <div class="win-msg">¡Has ganado el juego!<br>
      Todos cruzaron sanos y salvos.<br>
      <span style="font-size:1.8em;">🐺🐐🌽</span>
      </div>
    </div>
  `;
}

resetBtn.onclick = function() {
  left = ['🐺 Lobo', '🐐 Cabra', '🌽 Coles'];
  right = [];
  boat = [];
  boatOnLeft = true;
  selected = null;
  moveBtn.disabled = false;
  message.textContent = '';
  render();
};

render();
