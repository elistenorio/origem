import { inputRecipe, textareaRecipe } from "./campos"
import { buttonRecipe } from "./button"
import { badgeRecipe } from "./badge"
import { headingRecipe } from "./heading"
import { fieldOrigem } from "./field"
import { fieldsetOrigem } from "./fieldset"
import { nativeSelectOrigem } from "./native-select"
import { checkboxOrigem } from "./checkbox"
import { tabsOrigem } from "./tabs"
import { switchOrigem } from "./switch"

export const recipes = {
  input: inputRecipe,
  textarea: textareaRecipe,
  button: buttonRecipe,
  badge: badgeRecipe,
  heading: headingRecipe,
}

export const slotRecipes = {
  field: fieldOrigem,
  fieldset: fieldsetOrigem,
  nativeSelect: nativeSelectOrigem, // atenção: "nativeSelect" com S maiúsculo
  checkbox: checkboxOrigem,
  tabs: tabsOrigem,
  switch: switchOrigem,
}