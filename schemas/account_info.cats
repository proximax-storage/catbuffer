import "types.cats"

# Binary layout for account info
struct AccountInfo
	# TODO: meta not implemented in nis
	# Account metadata
	meta = any

	# Address of the account
	address = Address

	# Height when the address was published
	addressHeight = uint64

	# Public key of the account
	publicKey = string

	# Height when the public key was published
	publicKeyHeight = uint64

	# Number of mosaics
	mosaicsCount = uint64

	# Mosaics held by the account
	mosaics = array(Mosaic, mosaicsCount)
	
	# Importance of the account
	importance = uint64

	# Importance height of the account
	importanceHeight = uint64
