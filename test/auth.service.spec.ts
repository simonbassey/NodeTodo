import sinon from "sinon";
import chai from "chai";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import {UserRepository} from "../src/core/data/user.repository";
import { UserDocument } from "../src/core/models/domain/user.model";
import {AuthService} from "../src/core/services/auth.service";
import {Util} from "../src/core/services/utils.service";

const expect = chai.expect;
describe("Authentication Service", function() {

    let _authService: AuthService;
    let _userRepository: UserRepository;
    before("setup data dependencies", function() {
        // stub dependent modules
        sinon.stub(console, "log");
        sinon.stub(mongoose, "connect");
        sinon.stub(jwt, "sign").callsFake((pl, key) => "somegiberishtoken.base64encoded");

        _userRepository = new UserRepository();
        const mockUser = {firstName: "simon", lastName: "mocked", emailAddress: "somebody@somewhere.com", password: "12345", id: "1e23def"} as UserDocument;
        sinon.stub(_userRepository, "addUser").resolves(mockUser);
        sinon.stub(_userRepository, "getUsers").resolves([mockUser]);
        sinon.stub(_userRepository, "getUser").resolves(mockUser);
        sinon.stub(_userRepository, "updateUser").withArgs("1e23def", {firstName: "awase"}).resolves(true);
        sinon.stub(_userRepository, "filterUsers").callsFake((filter) => {
            const users = [mockUser].filter(u => u.emailAddress === filter.emailAddress);
            console.log(`fliter -> `, filter);
            return Promise.resolve(users);
        });
        sinon.stub(Util, "BcryptCompare").resolves(true);
        _authService = new AuthService(_userRepository);
    });

    it("Should AuthenticateUser with Validate Creds", async function() {
        const _authResult = await _authService.AuthenticateUser("somebody@somewhere.com", "12345");
        expect(_authResult.isAuthenticated).to.be.true;
    });

    it("Should not authenticate users with incorrect credentials", async function() {
        const _authResult = await _authService.AuthenticateUser("somebody@somewhere", "12345");
        expect(_authResult.info).to.be.null;
    });

    it("Should Generate jwtToken for valid SignInUser", async function() {
            const signedInUser = await _userRepository.getUser("12345");
            const token = _authService.createJwtToken(signedInUser);
            expect(token).to.not.be.null;
    });
    after("restore all mocked stubs", function() {
        sinon.restore();
    });
});
