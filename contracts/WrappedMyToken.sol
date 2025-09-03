// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { MyToken } from "./MyToken.sol";

contract WrappedMyToken is MyToken {
    constructor(string memory tokenName, string memory tokenSymbol) MyToken(tokenName, tokenSymbol){}

    //铸造具有指定tokenId的NFT代币，to 接收代币的地址，tokenId 要铸造的代币ID
    function mintTokenWithSpecificTokenId(address to, uint256 tokenId) public {
        /*是 OpenZeppelin ERC721 标准中的一个安全铸造函数
        地址验证：检查 to 地址不为零地址
        代币ID唯一性：确保 tokenId 尚未被铸造
        合约兼容性：如果接收方是合约地址，会调用其 onERC721Received 函数确认能接收NFT
        事件触发：铸造成功后会触发 Transfer 事件 */
        _safeMint(to, tokenId);
    }

}