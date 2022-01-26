import produce from 'immer';

class ReducerBuilder {
  cases = {};

  addCase = (actionType, actionPlan) => {
    if (!actionType) {
      throw new Error(
        'When calling "builder.addCase()", the "actionType" param is required',
      );
    }
    if (typeof actionPlan !== 'function') {
      throw new Error(
        'When calling "builder.addCase()", the "actionPlan" param is required and should be a function',
      );
    }
    if (Array.isArray(actionType)) {
      actionType.forEach((at) => {
        this.cases[at] = actionPlan;
      });
    } else {
      this.cases[actionType] = actionPlan;
    }

    // Return this for chaining
    return this;
  };

  reducer = (state, action) => {
    const actionPlan = this.cases[action.type];
    if (typeof actionPlan === 'function') {
      // Use immer when changing state ✨
      return produce(state, (draft) => actionPlan(draft, action));
    }
    console.log(
      `ActionType "${action.type} is not implemented, nothing changed."`,
    );
    return state;
  };
}

function createReducer(buildFunction) {
  if (typeof buildFunction !== 'function') {
    throw new Error(
      'When calling "createReducer()", the "buildFunction" param is required and should be a function',
    );
  }

  const builder = buildFunction(new ReducerBuilder());

  return builder.reducer;
}

export default createReducer;
