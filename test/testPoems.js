var should = require('should'),
	poems = require('../lib/poems');

describe('poems', function() {
	describe('#loadPoem() - Annabel Lee', function() {
		var annabelLeePoem = poems.loadPoem('Annabel Lee');
		it('should return a poem when the name is Annabel Lee', function() {
			annabelLeePoem.should.be.ok();
		});
		it('should have a title', function() {
			annabelLeePoem.should.have.property('title');
		});
		it('should have a publication year', function() {
			annabelLeePoem.should.have.property('year_published');
		});
    });
	describe('#loadPoem() - the raven', function() {
		var annabelLeePoem = poems.loadPoem('the raven');
		it('should return a poem when the name is the raven', function() {
			annabelLeePoem.should.be.ok();
		});
		it('should have a title', function() {
			annabelLeePoem.should.have.property('title');
		});
		it('should have a publication year', function() {
			annabelLeePoem.should.have.property('year_published');
		});
  });
});
