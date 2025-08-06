import { createBaseResponse } from './responseBuilder';
import { HttpStatus } from '@nestjs/common';

describe('responseBuilder', () => {
  it('should handle null data when fields are specified', () => {
    const result = createBaseResponse(null, HttpStatus.OK, 'id');
    expect(result).toEqual({
      result: {
        success: true,
        status: HttpStatus.OK,
        metadata: null,
        content: null,
      },
      version: 'v3',
    });
  });
});
