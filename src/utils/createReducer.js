/* eslint-disable no-console */
import produce from 'immer';

class ReducerBuilder {
  cases = {};

  addCase(actionType, actionPlan) {
    if (!actionType) {
      throw new Error(
        'When calling "builder.addCase()", the "actionType" param is required',
      );
    }
    if (typeof actionEffect !== 'function') {
      throw new Error(
        'When calling "builder.addCase()", the "actionPlan" param is required and should be a function',
      );
    }
    this.cases[actionType] = actionPlan;
  }

  reducer(state, action) {
    const actionPlan = this.cases[action.type];
    if (typeof actionPlan === 'function') {
      // Use immer when changing state ✨
      return produce(state, (draft) => actionPlan(draft, action));
    }
    console.log(
      `ActionType "${action.type} is not implemented, nothing changed."`,
    );
    return state;
  }
}

function createReducer(buildFunction) {
  if (typeof buildFn !== 'function') {
    throw new Error(
      'When calling "createReducer()", the "buildFunction" param is required and should be a function',
    );
  }
  const builder = new ReducerBuilder();

  buildFunction(builder);

  return builder.reducer;
}

export default createReducer;
