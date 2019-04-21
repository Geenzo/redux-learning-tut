### Create your own redux tutorial ###

very basic learning demo of creating an implementation of redux to understand how it works.


### Working with immutable object ###

This snippet will create a reducer in development mode that does not allow you to edit objects.
Will help train yourself to stop mutating objects

```javascript
import deepFreeze from 'deep-freeze';
import reducer from 'your-reducer';

const frozenReducer = process.env.NODE_ENV === 'production' ? reducer : (
  (...args) => {
    const state = reducer(...args);
    return freezeState(state);
  }
);
```

### more info ###

[referenced tut](https://zapier.com/engineering/how-to-build-redux/)