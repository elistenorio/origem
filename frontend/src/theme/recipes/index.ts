import { inputRecipe, textareaRecipe } from "./campos"
import { buttonRecipe } from "./button"
import { badgeRecipe } from "./badge"
import { headingRecipe } from "./heading"
import { fieldOrigem } from "./field"
import { fieldsetOrigem } from "./fieldset"
import { nativeSelectOrigem } from "./native-select"
import { checkboxOrigem } from "./checkbox"
import { tabsOrigem } from "./tabs"
import { cardOrigem } from "./card"
import { dialogOrigem } from "./dialog"
import { radioCardOrigem } from "./radio-card"
import { tableOrigem } from "./table"
import { stepsOrigem } from "./steps"
import { ratingGroupOrigem } from "./rating-group"
import { emptyStateOrigem } from "./empty-state"
import { linkRecipe } from "./link"
import { radioGroupOrigem } from "./radio-group"

export const recipes = {
  input: inputRecipe,
  textarea: textareaRecipe,
  button: buttonRecipe,
  badge: badgeRecipe,
  heading: headingRecipe,
  link: linkRecipe,
}

export const slotRecipes = {
  field: fieldOrigem,
  fieldset: fieldsetOrigem,
  nativeSelect: nativeSelectOrigem, // atenção: "nativeSelect" com S maiúsculo
  checkbox: checkboxOrigem,
  tabs: tabsOrigem,
  card: cardOrigem,
  dialog: dialogOrigem,
  radioCard: radioCardOrigem,
  table: tableOrigem,
  steps: stepsOrigem,
  ratingGroup: ratingGroupOrigem,
  emptyState: emptyStateOrigem,
  radioGroup: radioGroupOrigem,
}