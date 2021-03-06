import { Button, Form, Icon, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";
import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "store";
import styles from "./signIn.module.scss";
import { Link, Redirect } from "react-router-dom";
import { signIn } from "actions/authActions";
import { bindActionCreators, Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { credsType } from "types/auth";

interface UserFormProps extends FormComponentProps {}

interface LinkDispatchProps {
  signIn: (creds: credsType) => void;
}

interface LinkStateProps {
  authError: string;
  isLoggedIn: boolean;
}

interface SignInProps {
  authError: string;
  isLoggedIn: boolean;
}

type Props = UserFormProps & LinkDispatchProps & SignInProps;

type State = LinkStateProps;

class SignIn extends React.Component<Props, State> {
  public handleSubmit = (e: React.SyntheticEvent) => {
    const { signIn, authError } = this.props;
    console.error(authError);

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        signIn(values);
      }
    });
  };

  public render() {
    const { getFieldDecorator } = this.props.form;
    const { authError, isLoggedIn } = this.props;

    return (
      <React.Fragment>
        {isLoggedIn && <Redirect to="/" />}
        <div className={styles.signInWrapper}>
          <Form onSubmit={this.handleSubmit} className={styles.signInForm}>
            <h1>Sign In</h1>
            <Form.Item>
              {getFieldDecorator("email", {
                rules: [
                  { required: true, message: "Please input your email!" },
                  {
                    type: "email",
                    message: "The input is not valid email!"
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Email"
                />
              )}
            </Form.Item>
            <Form.Item hasFeedback>
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: "Please input your Password!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </Form.Item>
            {authError && (
              <span className={styles.errorMessage}>{authError}</span>
            )}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.signInButton}
              >
                Log in
              </Button>
              Or <Link to="/sign-up">Register now!</Link>
            </Form.Item>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  (state: AppState): LinkStateProps => ({
    authError: state.auth.authError,
    isLoggedIn: state.firebase.auth.uid
  }),
  (dispatch: ThunkDispatch<any, any, Action>): LinkDispatchProps => ({
    signIn: bindActionCreators(signIn, dispatch)
  })
)(Form.create<UserFormProps>({ name: "sign-in" })(SignIn));
