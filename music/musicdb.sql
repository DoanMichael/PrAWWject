create table if not exists music (
id int(1) not null auto_increment,
link_id varchar(11) not null,
start_time int(1) not null,
artist_name varchar(30) null,
song_title varchar(30) null,
primary key (id)
)  ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=13;
insert into music (id, link_id, start_time, artist_name, song_title) values

(1,'89D2gmza6o8',0,'lullaby','lullaby'),
(2,'Z2qLmgnl6Mg',77,'Keith Emerson','Streets to Blame'),
(3,'ioULRchLwB0',35,'Lemon Demon','touch tone telephone'),
(4,'WEMMVHAINFM',54,'Guiseppe Verdi','il Trovatore'),
(5,'z8cwVLPt82w',10,'Ramin Djawadi','Light of the seven'),
(6,'kLp_Hh6DKWc',55,'Grieg','Hall of the mountain King'),
(7,'Y9ePLV6VHF0',3,'Common','The Food'),
(8,'6ISaCNLcsvM',1,'Sam Cooke','Twistin the night away'),
(9,'3K2ly5Ioxf8',0,'old school jazz','old school jazz'),
(10,'rVqAdIMQZlk',25,'RJD2','Ghostwriter'),
(11,'_Yv8P19pwlE',33,'Twin Peaks','Platonick Drive'),
(12,'gxnvxtYfsd4',19,'robin hood','Whistle stop');
