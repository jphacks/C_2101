package dev.abelab.jphacks.service;

import mockit.Injectable;
import mockit.Tested;

import dev.abelab.jphacks.logic.UserLogic;
import dev.abelab.jphacks.repository.UserRepository;

/**
 * AuthService Unit Test
 */
class AuthService_UT extends AbstractService_UT {

	@Injectable
	UserLogic userLogic;

	@Injectable
	UserRepository userRepository;

	@Tested
	AuthService authService;

}
