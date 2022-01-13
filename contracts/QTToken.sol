//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract QTToken is ERC20, AccessControl {
  
    uint256 public constant LOCK_PERIOD = 60 * 60 * 24 * 365;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    address public immutable liqAddress;
    uint256 public immutable deployed;

    constructor(
        address _owner,
        address privateSale,
        address preSale,
        address crowdsale,
        address marketingTeam,
        address managementTeam,
        address advisors,
        address bounties,
        address liquidityPool,
        address foundersReserve
    ) ERC20("QAM Token", "QAM") {
        require(_owner != address(0) 
            && privateSale != address(0)
            && preSale != address(0)
            && crowdsale != address(0)
            && marketingTeam != address(0)
            && managementTeam != address(0)
            && advisors != address(0)
            && bounties != address(0)
            && liquidityPool != address(0)
            && foundersReserve != address(0)
        , "QT: address = 0");
        
        liqAddress = liquidityPool;
        deployed = block.timestamp;
        _mint(privateSale, 5000000 * (10 ** 18));
        _mint(preSale, 5000000 * (10 ** 18));
        _mint(crowdsale, 10000000 * (10 ** 18));
        _mint(_owner, 51000000 * (10 ** 18));
        _mint(marketingTeam, 3000000 * (10 ** 18));
        _mint(managementTeam, 3000000 * (10 ** 18));
        _mint(advisors, 1000000 * (10 ** 18));
        _mint(bounties, 1000000 * (10 ** 18));
        _mint(liquidityPool, 1000000 * (10 ** 18));
        _mint(foundersReserve, 20000000 * (10 ** 18));
        _grantRole(MINTER_ROLE, _owner);
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);
    }

    function mint(address to, uint256 amount) public virtual {
        require(hasRole(MINTER_ROLE, _msgSender()), "QT: must have minter role to mint");
        _mint(to, amount);
    }

    function burn(uint256 amount) public virtual {
        _burn(_msgSender(), amount);
    }

    function burnFrom(address account, uint256 amount) public virtual {
        uint256 currentAllowance = allowance(account, _msgSender());
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        unchecked {
            _approve(account, _msgSender(), currentAllowance - amount);
        }
        _burn(account, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if( from == liqAddress ) {
            require( block.timestamp - deployed >= LOCK_PERIOD, "QT: out of time for LIQ");
        }
    }

}
