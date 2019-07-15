import React from "react";
import { configure, shallow } from "enzyme";
import { expect } from "chai";
import App from "./App";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("App component testing", function() {
  it("renders welcome message", function() {
    const wrapper = shallow(<App />);

    expect(wrapper.exists(".App-header")).to.equal(true);
  });
});
