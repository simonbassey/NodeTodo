import sinon from "sinon";
import chai from "chai";

import {UserRepository} from "../src/core/data/user.repository";
import { UserDocument } from "../src/core/models/domain/user.model";
import {AuthService} from "../src/core/services/auth.service";
import {Util} from "../src/core/services/utils.service";

describe("Authentication Service", function() {
    const _userRepository: UserRepository = new UserRepository();
    let _authService: AuthService;
    before("setup data dependencies", function() {
        // mocking repository
        const mockUser = {firstName: "simon", lastName: "mocked", emailAddress: "somebody@somewhere.com", password: "12345", id: "1e23def"} as UserDocument;
        sinon.stub(_userRepository, "addUser").resolves(mockUser);
        sinon.stub(_userRepository, "getUsers").resolves([mockUser]);
        sinon.stub(_userRepository, "getUser").resolves(mockUser);
        sinon.stub(_userRepository, "updateUser").withArgs("1e23def", {firstName: "awase"}).resolves(true);
        sinon.stub(_userRepository, "filterUsers").callsFake((filter) => {
            const users = [mockUser].filter(u => u.emailAddress === filter.email);
            return Promise.resolve(users);
        });
        // mocking other service calls
        sinon.stub(Util, "BcryptCompare").resolves(true);
        // silence console
        sinon.stub(console, "log");
        _authService = new AuthService(_userRepository);
    });

    it("Should AuthenticateUser with Validate Creds", async function() {
        // arrange
        // act
        const _authResult = await _authService.AuthenticateUser("somebody@somewhere.com", "12345");
        // assert
        chai.expect(_authResult).keys(["isAuthenticated", "info"]).is.not.empty;

    });

    after("restore all mocked stubs", function() {
        sinon.restore();
    });
});
