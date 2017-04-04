## Table of Contents

- [Installation](#installation)
- [Usage](#license)
- [License](#license)
- [About](#about)

## Installation

```yarn add react-forml-redux```

## Usage

Run the saga:

```
import { saga } from 'react-forml-redux';

// Run it.
```
Then there are two options:

### Option 1:

In your container:

```
import { bindSubmitFormToPromise } from 'react-forml-redux';
import { signin } from './creators';
import { SIGNIN_SUCCESS, SIGNIN_FAILURE } from './actions';

class SigninFormContainer extends Component {
  onSubmit = ({ email, password }) => {
    const { signin: signinDispatch } = this.props;

    return signinDispatch(email, password); // It's a promise.
  }
}

const mapDispatchToProps = dispatch => ({
  signin: bindSubmitFormToPromise(signin, SIGNIN_SUCCESS, SIGNIN_FAILURE, dispatch),
});

export default connect(null, mapDispatchToProps)(withRouter(SigninFormContainer));
```

### Option 2

In your creator:

```
function signin(payload) {
  type: SIGNIN_REQUEST,
  payload,
  meta: {
    successAction: SIGNIN_SUCCESS,
    failureAction: SIGNIN_FAILURE,
  },
}
```

Then in your container:

```
import { bindSubmitFormToPromise } from 'react-forml-redux';
import { signin } from './creators';

class SigninFormContainer extends Component {
  onSubmit = ({ email, password }) => {
    const { signin: signinDispatch } = this.props;

    return signinDispatch(email, password); // It's a promise.
  }
}

const mapDispatchToProps = dispatch => ({
  signin: bindSubmitFormToPromise(signin, dispatch),
});

export default connect(null, mapDispatchToProps)(withRouter(SigninFormContainer));
```

## License

© 2017 [Postform, Inc.](https://postform.io)

It is free software, and may be redistributed under the terms specified in the (license)[LICENSE].
