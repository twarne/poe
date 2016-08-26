var should = require('should'),
	poems = require('../lib/poems');

describe('poems', function() {
	describe('#loadPoem()', function() {
		var annabelLeePoem = poems.loadPoem('Annabel Lee');
		it('should return a poem when the name is Annabel Lee', function() {
			annabelLeePoem.should.be.ok();
		});
		it('should have a title', function() {
			annabelLeePoem.should.have.property('title');
		});
		it('shouldh have a publication year', function() {
			annabelLeePoem.should.have.property('year_published');
		});
  });
});
