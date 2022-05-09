/**
 * expects an `Event`,
 * returns `e.currentTarget.value`.
 */
export const getInputVal = (
  e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement>
) => e.currentTarget.value
