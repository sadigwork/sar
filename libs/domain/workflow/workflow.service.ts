validateTransition(current, next) {

  const allowed = ApplicationWorkflow[current]

  if (!allowed.includes(next)) {
     throw new Error('Invalid workflow transition')
  }

}