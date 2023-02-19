var METALANG = "\nADR  PROGRAM\nPROGRAM\n       TST  \".SYNTAX\"\n       BF  A0 \n       ID \n       BE \n       CL  \"ADR \"\n       CI \n       OUT \nA1 \n       JMP  DEFINITION\n       BF  A2 \nA2 \n       BT  A3 \n       JMP  COMMENT\n       BF  A4 \nA4 \nA3 \n       BT  A1 \n       SET \n       BE \n       TST  \".END\"\n       BE \n       CL  \"END\"\n       OUT \nA0 \nA5 \n       R \nOUT1\n       TST  \"*1\"\n       BF  A6 \n       CL  \"GN1\"\n       OUT \nA6 \n       BT  A7 \n       TST  \"*2\"\n       BF  A8 \n       CL  \"GN2\"\n       OUT \nA8 \n       BT  A7 \n       TST  \"*\"\n       BF  A9 \n       CL  \"CI\"\n       OUT \nA9 \n       BT  A7 \n       SR \n       BF  A10 \n       CL  \"CL \"\n       CI \n       OUT \nA10 \n       BT  A7 \n       TST  \"#\"\n       BF  A11 \n       NUM \n       BE \n       CL  \"GROUP\"\n       CI \n       OUT \nA11 \nA7 \n       R \nOUTPUT\n       TST  \"->\"\n       BF  A12 \nA13 \n       TST  \"(\"\n       BT  A13 \n       SET \n       BE \nA14 \n       JMP  OUT1\n       BT  A14 \n       SET \n       BE \n       TST  \")\"\n       BE \nA12 \n       BT  A15 \n       TST  \".LABEL\"\n       BF  A16 \n       CL  \"LB\"\n       OUT \n       JMP  OUT1\n       BE \nA16 \nA15 \n       BF  A17 \n       CL  \"OUT\"\n       OUT \nA17 \nA18 \n       R \nEX3\n       ID \n       BF  A19 \n       CL  \"JMP \"\n       CI \n       OUT \nA19 \n       BT  A20 \n       SR \n       BF  A21 \n       CL  \"TST \"\n       CI \n       OUT \nA21 \n       BT  A20 \n       TST  \".ID\"\n       BF  A22 \n       CL  \"ID\"\n       OUT \nA22 \n       BT  A20 \n       TST  \".ROL\"\n       BF  A23 \n       CL  \"ROL\"\n       OUT \nA23 \n       BT  A20 \n       TST  \".NOT\"\n       BF  A24 \n       SR \n       BE \n       CL  \"NOT\"\n       CI \n       OUT \nA24 \n       BT  A20 \n       TST  \"~\"\n       BF  A25 \n       SR \n       BE \n       CL  \"NOT\"\n       CI \n       OUT \nA25 \n       BT  A20 \n       TST  \".NUMBER\"\n       BF  A26 \n       CL  \"NUM\"\n       OUT \nA26 \n       BT  A20 \n       TST  \".STRING\"\n       BF  A27 \n       CL  \"SR\"\n       OUT \nA27 \n       BT  A20 \n       TST  \"(\"\n       BF  A28 \n       JMP  EX1\n       BE \n       TST  \")\"\n       BE \nA28 \n       BT  A20 \n       JMP  REGEXP\n       BF  A29 \nA29 \n       BT  A20 \n       TST  \".EMPTY\"\n       BF  A30 \n       CL  \"SET\"\n       OUT \nA30 \n       BT  A20 \n       TST  \"$\"\n       BF  A31 \n       LB \n       GN1 \n       OUT \n       JMP  EX3\n       BE \n       CL  \"BT \"\n       GN1 \n       OUT \n       CL  \"SET\"\n       OUT \nA31 \nA20 \n       R \nEX2\n       JMP  EX3\n       BF  A32 \n       CL  \"BF \"\n       GN1 \n       OUT \nA32 \n       BT  A33 \n       JMP  OUTPUT\n       BF  A34 \nA34 \nA33 \n       BF  A35 \nA36 \n       JMP  EX3\n       BF  A37 \n       CL  \"BE\"\n       OUT \nA37 \n       BT  A38 \n       JMP  OUTPUT\n       BF  A39 \nA39 \nA38 \n       BT  A36 \n       SET \n       BE \n       LB \n       GN1 \n       OUT \nA35 \nA40 \n       R \nEX1\n       JMP  EX2\n       BF  A41 \nA42 \n       TST  \"|\"\n       BF  A43 \n       CL  \"BT \"\n       GN1 \n       OUT \n       JMP  EX2\n       BE \nA43 \n       BT  A44 \n       JMP  COMMENT\n       BF  A45 \nA45 \nA44 \n       BT  A42 \n       SET \n       BE \n       LB \n       GN1 \n       OUT \nA41 \nA46 \n       R \nREGEXP\n       TST  \"/\"\n       BF  A47 \n       NOT \"/\"\n       BE \n       CL  \"REGEXP\"\n       CI \n       OUT \n       TST  \"/\"\n       BE \nA47 \nA48 \n       R \nDEFINITION\n       ID \n       BF  A49 \n       LB \n       CI \n       OUT \n       TST  \"=\"\n       BE \n       JMP  EX1\n       BE \n       TST  \";\"\n       BE \n       CL  \"R\"\n       OUT \nA49 \nA50 \n       R \nCOMMENT\n       TST  \"[\"\n       BF  A51 \n       NOT \"]\"\n       BE \n       TST  \"]\"\n       BE \nA51 \nA52 \n       R \n       END \n       \n";
export { METALANG };