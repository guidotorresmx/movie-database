window.addEventListener("DOMContentLoaded", () => {
  function addStepBtnClickHandler(event) {
    event.preventDefault();
    var cln = document
      .getElementsByClassName("steps-element")[0]
      .cloneNode(true);
    cln.children[1].required = false;
    document.getElementById("steps-array").appendChild(cln);
    return false;
  }

  function addIngrBtnClickHandler(event) {
    event.preventDefault();
    var cln = document
      .getElementsByClassName("ingredients-element")[0]
      .cloneNode(true);
    cln.children[1].required = false;
    cln.children[1].required = false;
    document.getElementById("ingredients-array").appendChild(cln);
    return false;
  }
  const addIngrBtns = document.getElementsByClassName("add-ingredient-row");
  const addStepBtns = document.getElementsByClassName("add-step-row");

  Array.from(addIngrBtns).forEach((btn) => {
    btn.addEventListener("click", addIngrBtnClickHandler);
  });
  Array.from(addStepBtns).forEach((btn) => {
    btn.addEventListener("click", addStepBtnClickHandler);
  });
});
