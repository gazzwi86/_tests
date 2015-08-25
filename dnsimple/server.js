var dnsimple = new require('dnsimple')({
	email: 'gethyn1@gmail.com', 
	token: 'abc123' 
});

// list all associated domains
dnsimple.domains.list( true, console.log );

// check a domain
domains.check(domainname, function (blah){
	console.log('blah');
});

// // buy domain
// dnsimple.domains.register( 'example.tld', 1, console.log );

// // apply a templaete to a domain
// dnsimple.domains.template ( domainname, templateID, cb );

// // set / update autorenew
// dnsimple.domains.autorenew( 'example.tld', true, console.log );

// // update nameserver
// dnsimple.domains.nameservers(
//     'example.tld',
//     {
//         ns1:    'ns1.company.tld',
//         ns2:    'ns2.company.tld'
//     },
//     console.log
// );